import os
import base64
import tempfile
import logging
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from backend.config import config
from backend.vector import faiss_db
from backend.ai import jd_analyzer, embeddings, llm
from backend.ranking import engine as ranking_engine
from backend.dataset import parser as dataset_parser
from backend.reports import exporter as reports_exporter

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("backend.api")

app = FastAPI(title="TalentAI Python API Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup DB initialization
@app.on_event("startup")
def startup_event():
    logger.info("Starting up FastAPI application...")
    faiss_db.initialize_db()

# Pydantic schemas
class JDPayload(BaseModel):
    rawText: str

class UploadJobPayload(BaseModel):
    rawText: Optional[str] = ""
    fileName: Optional[str] = ""
    base64: Optional[str] = None

class ResumePayload(BaseModel):
    rawText: Optional[str] = ""
    fileName: Optional[str] = ""
    base64: Optional[str] = None

class CandidatePayload(BaseModel):
    candidate: Dict[str, Any]

class LoadDatasetPayload(BaseModel):
    limit: Optional[int] = 100
    file_path: Optional[str] = "datasets/candidates.jsonl"

class RankPayload(BaseModel):
    job: Dict[str, Any]
    candidates: List[Dict[str, Any]]

class ChatPayload(BaseModel):
    prompt: str
    history: List[Dict[str, Any]] = []
    job: Optional[Dict[str, Any]] = None

class ExportPayload(BaseModel):
    scores: List[Dict[str, Any]]
    candidates: List[Dict[str, Any]]
    jobTitle: Optional[str] = "Job"
    format: str  # "csv", "excel", "json" or "pdf"

class SubmissionPayload(BaseModel):
    candidates_file: Optional[str] = "datasets/candidates.jsonl"
    job_file: Optional[str] = "datasets/job_description.docx"
    output_csv: Optional[str] = "submission.csv"

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "model": config.EMBEDDING_MODEL_NAME}

@app.post("/api/upload-job")
def upload_job(payload: UploadJobPayload):
    try:
        raw_text = payload.rawText
        if payload.base64:
            file_bytes = base64.b64decode(payload.base64)
            suffix = os.path.splitext(payload.fileName)[1].lower() if payload.fileName else ".docx"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                temp_file.write(file_bytes)
                temp_file_path = temp_file.name
            try:
                # If docx, use our job_analyzer
                if suffix == ".docx":
                    from backend.ai.job_analyzer import analyze_job_docx
                    result = analyze_job_docx(temp_file_path)
                else:
                    raw_text = dataset_parser.extract_text(temp_file_path)
                    result = jd_analyzer.analyze_job_description(raw_text)
            finally:
                try:
                    os.unlink(temp_file_path)
                except Exception:
                    pass
            return result
        
        if not raw_text or not raw_text.strip():
            raise HTTPException(status_code=400, detail="Job description text or base64 file data is required")
            
        result = jd_analyzer.analyze_job_description(raw_text)
        return result
    except Exception as e:
        logger.error(f"Error uploading/parsing job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parse-jd")
def parse_jd(payload: JDPayload):
    try:
        result = jd_analyzer.analyze_job_description(payload.rawText)
        return result
    except Exception as e:
        logger.error(f"Error parsing JD: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/parse-resume")
def parse_resume(payload: ResumePayload):
    try:
        raw_text = payload.rawText
        
        # If base64 file is uploaded, extract text from it
        if payload.base64:
            try:
                file_bytes = base64.b64decode(payload.base64)
                suffix = os.path.splitext(payload.fileName)[1].lower() if payload.fileName else ".txt"
                
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                    temp_file.write(file_bytes)
                    temp_file_path = temp_file.name
                    
                raw_text = dataset_parser.extract_text(temp_file_path)
                try:
                    os.unlink(temp_file_path)
                except Exception:
                    pass
            except Exception as e:
                logger.error(f"Failed to extract document: {e}")
                raise HTTPException(status_code=400, detail=f"Failed to extract text from document: {str(e)}")
                
        if not raw_text or not raw_text.strip():
            raise HTTPException(status_code=400, detail="Resume content or base64 file data is required")
            
        parsed_cand = dataset_parser.parse_resume_to_candidate(raw_text)
        return parsed_cand
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/load-dataset")
def load_dataset(payload: LoadDatasetPayload):
    try:
        from backend.dataset.loader import load_candidates_lazy
        count = 0
        for cand in load_candidates_lazy(payload.file_path, limit=payload.limit):
            faiss_db.add_candidate(cand)
            count += 1
        return {"success": True, "count": count}
    except Exception as e:
        logger.error(f"Error loading dataset: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/add-candidate")
def add_candidate(payload: CandidatePayload):
    try:
        faiss_db.add_candidate(payload.candidate)
        return {"success": True, "id": payload.candidate.get("candidate_id") or payload.candidate.get("id")}
    except Exception as e:
        logger.error(f"Error adding candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/candidates/{candidate_id}")
def delete_candidate(candidate_id: str):
    try:
        faiss_db.delete_candidate(candidate_id)
        return {"success": True}
    except Exception as e:
        logger.error(f"Error deleting candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/candidate/{candidate_id}")
def get_candidate(candidate_id: str):
    # Support lookup from faiss database metadata
    cand = faiss_db._metadata.get(candidate_id)
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand

@app.get("/api/search")
def search_candidates(query: str = Query(..., min_length=1), limit: int = 5):
    try:
        results = faiss_db.search_candidates(query, limit)
        # Format results
        formatted = []
        for r in results:
            formatted.append({
                "candidate": r["candidate"],
                "semanticScore": r["semantic_score"]
            })
        return formatted
    except Exception as e:
        logger.error(f"Semantic search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rank")
def rank_candidates(payload: RankPayload):
    try:
        job = payload.job
        candidates = payload.candidates
        
        # Use our updated composite score
        scores = []
        for cand in candidates:
            score_res = ranking_engine.score_candidate(cand, job)
            scores.append(score_res)
            
        # Re-sort scores by score descending
        scores.sort(key=lambda s: s["score"], reverse=True)
        # Assign ranks
        for idx, s in enumerate(scores):
            s["rank"] = idx + 1
            
        return scores
    except Exception as e:
        logger.error(f"Ranking candidates failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat_copilot(payload: ChatPayload):
    try:
        # Build prompt context
        history_formatted = []
        for h in payload.history:
            history_formatted.append({
                "role": "user" if h.get("sender") == "user" else "model",
                "parts": [h.get("text", "")]
            })
            
        # Get active database context to provide to LLM
        all_cands = faiss_db.get_all_candidates()
        
        context_data = "\nContext Data:\n"
        if payload.job:
            context_data += f"- Target Job Description: {payload.job.get('title')} (skills: {', '.join(payload.job.get('skills', []))})\n"
        context_data += f"- Candidates in system: {len(all_cands)}\n"
        for idx, c in enumerate(all_cands[:8]):
            # Support both format types
            c_name = c.get('profile', {}).get('anonymized_name') or c.get('name')
            c_skills = [s.get('name') for s in c.get('skills', [])] if isinstance(c.get('skills'), list) and c.get('skills') and isinstance(c.get('skills')[0], dict) else c.get('skills', [])
            c_summary = c.get('profile', {}).get('summary') or c.get('summary', '')
            context_data += f"  * {c_name} (Skills: {', '.join(c_skills)}, Exp Summary: {c_summary[:100]}...)\n"
            
        system_instruction = (
            f"You are TalentAI Copilot, an elite AI recruitment advisor. "
            f"You have direct access to candidate profiles and resume parsed details. "
            f"Keep explanations concise, professional, recruiter-focused and structured with bullet points. "
            f"\n{context_data}"
        )
        
        response_text = llm.generate_text_response(
            prompt=payload.prompt,
            system_instruction=system_instruction,
            chat_history=history_formatted
        )
        return {"text": response_text}
    except Exception as e:
        logger.error(f"Copilot chat failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/copilot")
def copilot_alias(payload: ChatPayload):
    return chat_copilot(payload)

@app.post("/api/stats")
def get_stats(payload: RankPayload):
    try:
        job = payload.job
        candidates = payload.candidates
        
        total_candidates = len(candidates)
        
        # Calculate matching scores without triggering heavy LLM explanations
        scores = []
        for cand in candidates:
            score_res = ranking_engine.score_candidate(cand, job, generate_explanation=False)
            scores.append(score_res)
            
        top_matches = sum(1 for s in scores if s["score"] >= 85)
        average_score = round(sum(s["score"] for s in scores) / max(1, len(scores)), 1)
        
        # Skill distributions
        skill_counts = {}
        for cand in candidates:
            skills = cand.get("skills", [])
            for skill in skills:
                # Handle both object skill or string skill
                skill_name = skill.get("name", "") if isinstance(skill, dict) else str(skill)
                skill_cleaned = skill_name.strip()
                if skill_cleaned:
                    skill_counts[skill_cleaned] = skill_counts.get(skill_cleaned, 0) + 1
        skills_dist = [
            {"name": k, "count": v} 
            for k, v in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:8]
        ]
        
        # Experience distributions
        exp_counts = {
            "Junior (0-2 yrs)": 0,
            "Mid-Level (3-4 yrs)": 0,
            "Senior (5-8 yrs)": 0,
            "Principal (9+ yrs)": 0
        }
        for cand in candidates:
            profile = cand.get("profile", {})
            total_exp = float(profile.get("years_of_experience") or sum(e.get("yearsOfExp", 0) or 0 for e in cand.get("experience", [])))
            if total_exp <= 2: exp_counts["Junior (0-2 yrs)"] += 1
            elif total_exp <= 4: exp_counts["Mid-Level (3-4 yrs)"] += 1
            elif total_exp <= 8: exp_counts["Senior (5-8 yrs)"] += 1
            else: exp_counts["Principal (9+ yrs)"] += 1
        experience_dist = [{"name": k, "count": v} for k, v in exp_counts.items()]
        
        # Education distributions
        edu_counts = {
            "Bachelor's": 0,
            "Master's / MBA": 0,
            "Ph.D. / Doctorate": 0,
            "Other/Self-taught": 0
        }
        for cand in candidates:
            degrees = " ".join(e.get("degree", "").lower() for e in cand.get("education", []))
            if "ph.d" in degrees or "phd" in degrees or "doctor" in degrees:
                edu_counts["Ph.D. / Doctorate"] += 1
            elif "master" in degrees or "m.s" in degrees or "m.tech" in degrees or "mba" in degrees:
                edu_counts["Master's / MBA"] += 1
            elif "bachelor" in degrees or "b.s" in degrees or "b.tech" in degrees or "b.e" in degrees:
                edu_counts["Bachelor's"] += 1
            else:
                edu_counts["Other/Self-taught"] += 1
        education_dist = [{"name": k, "count": v} for k, v in edu_counts.items()]
        
        # Score Histogram
        ranges = ["< 50", "50 - 59", "60 - 69", "70 - 79", "80 - 89", "90 - 100"]
        range_counts = {r: 0 for r in ranges}
        for s in scores:
            score = s["score"]
            if score < 50: range_counts["< 50"] += 1
            elif score <= 59: range_counts["50 - 59"] += 1
            elif score <= 69: range_counts["60 - 69"] += 1
            elif score <= 79: range_counts["70 - 79"] += 1
            elif score <= 89: range_counts["80 - 89"] += 1
            else: range_counts["90 - 100"] += 1
        score_histogram = [{"range": k, "count": v} for k, v in range_counts.items()]
        
        # Generate 2D coordinates for Candidate Semantic Cluster Visualization
        semantic_clusters = []
        for idx, cand in enumerate(candidates):
            cid = cand.get("candidate_id") or cand.get("id")
            score_obj = next((s for s in scores if s["candidateId"] == cid), {})
            score_val = score_obj.get("score", 50)
            
            breakdown = score_obj.get("breakdown", {})
            x_coord = breakdown.get("skills", 50)
            y_coord = breakdown.get("experience", 50)
            
            c_name = cand.get("profile", {}).get("anonymized_name") or cand.get("name")
            
            semantic_clusters.append({
                "id": cid,
                "name": c_name,
                "x": int(x_coord),
                "y": int(y_coord),
                "score": int(score_val),
                "recommendation": score_obj.get("explanation", {}).get("hiringRecommendation", "Shortlisted")
            })
            
        return {
            "totalCandidates": total_candidates,
            "topMatches": top_matches,
            "averageScore": average_score,
            "skillsDistribution": skills_dist,
            "experienceDistribution": experience_dist,
            "educationDistribution": education_dist,
            "scoreHistogram": score_histogram,
            "semanticClusters": semantic_clusters
        }
    except Exception as e:
        logger.error(f"Error computing statistics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics")
def analytics_alias(payload: RankPayload):
    return get_stats(payload)

@app.post("/api/export")
def export_report(payload: ExportPayload):
    try:
        candidates_map = {c.get("candidate_id") or c.get("id"): c for c in payload.candidates}
        
        if payload.format == "csv":
            csv_str = reports_exporter.generate_csv_report(payload.scores, candidates_map)
            base64_str = base64.b64encode(csv_str.encode("utf-8")).decode("utf-8")
            return {"data": base64_str, "contentType": "text/csv", "fileName": f"talentai_ranking_{payload.jobTitle.replace(' ', '_')}.csv"}
            
        elif payload.format == "json":
            json_str = reports_exporter.generate_json_report(payload.scores, candidates_map)
            base64_str = base64.b64encode(json_str.encode("utf-8")).decode("utf-8")
            return {"data": base64_str, "contentType": "application/json", "fileName": f"talentai_ranking_{payload.jobTitle.replace(' ', '_')}.json"}
            
        elif payload.format == "excel":
            excel_bytes = reports_exporter.generate_excel_report(payload.scores, candidates_map)
            base64_str = base64.b64encode(excel_bytes).decode("utf-8")
            return {"data": base64_str, "contentType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "fileName": f"talentai_ranking_{payload.jobTitle.replace(' ', '_')}.xlsx"}
            
        elif payload.format == "pdf":
            html_str = reports_exporter.generate_pdf_summary_html(payload.scores, candidates_map, payload.jobTitle)
            base64_str = base64.b64encode(html_str.encode("utf-8")).decode("utf-8")
            return {"data": base64_str, "contentType": "text/html", "fileName": f"talentai_report_{payload.jobTitle.replace(' ', '_')}.html"}
            
        else:
            raise HTTPException(status_code=400, detail="Unsupported export format")
    except Exception as e:
        logger.error(f"Error generating export: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-submission")
def generate_submission(payload: SubmissionPayload):
    try:
        from backend.reports.submission import generate_submission_csv
        success = generate_submission_csv(
            candidates_file=payload.candidates_file,
            job_file=payload.job_file,
            output_csv=payload.output_csv
        )
        return {"success": success, "output": payload.output_csv}
    except Exception as e:
        logger.error(f"Error generating submission: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api.app:app", host=config.HOST, port=config.PORT, reload=False)
