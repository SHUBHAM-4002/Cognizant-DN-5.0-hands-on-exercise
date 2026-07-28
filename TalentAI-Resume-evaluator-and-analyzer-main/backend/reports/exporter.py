import csv
import json
import io
import logging
from openpyxl import Workbook

logger = logging.getLogger(__name__)

def generate_csv_report(scores: list[dict], candidates_map: dict) -> str:
    """Generate CSV string of ranked candidates."""
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Rank", "Candidate Name", "Email", "Phone", "Overall Match Score", 
        "Confidence Score", "Semantic Match", "Experience Match", 
        "Skills Match", "Projects Match", "Hiring Recommendation"
    ])
    
    for idx, item in enumerate(scores):
        cand_id = item.get("candidateId")
        cand = candidates_map.get(cand_id, {})
        expl = item.get("explanation", {})
        
        writer.writerow([
            idx + 1,
            cand.get("name", "Unknown"),
            cand.get("email", ""),
            cand.get("phone", ""),
            item.get("score", 0),
            item.get("confidence", 0),
            item.get("breakdown", {}).get("semantic", 0),
            item.get("breakdown", {}).get("experience", 0),
            item.get("breakdown", {}).get("skills", 0),
            item.get("breakdown", {}).get("projects", 0),
            expl.get("recommendation", "")
        ])
    return output.getvalue()

def generate_json_report(scores: list[dict], candidates_map: dict) -> str:
    """Generate detailed JSON report of match analytics."""
    report_data = []
    for idx, item in enumerate(scores):
        cand_id = item.get("candidateId")
        cand = candidates_map.get(cand_id, {})
        report_data.append({
            "rank": idx + 1,
            "candidate": {
                "id": cand_id,
                "name": cand.get("name"),
                "email": cand.get("email"),
                "skills": cand.get("skills"),
                "summary": cand.get("summary")
            },
            "overall_score": item.get("score"),
            "confidence_score": item.get("confidence"),
            "breakdown": item.get("breakdown"),
            "explanation": item.get("explanation")
        })
    return json.dumps(report_data, indent=2, ensure_ascii=False)

def generate_excel_report(scores: list[dict], candidates_map: dict) -> bytes:
    """Generate Excel binary buffer of matching results."""
    wb = Workbook()
    ws = wb.active
    ws.title = "TalentAI Ranking"
    
    # Headers
    ws.append([
        "Rank", "Candidate Name", "Email", "Phone", "Overall Match Score", 
        "Confidence Score", "Semantic Match", "Experience Match", 
        "Skills Match", "Projects Match", "Hiring Recommendation"
    ])
    
    for idx, item in enumerate(scores):
        cand_id = item.get("candidateId")
        cand = candidates_map.get(cand_id, {})
        expl = item.get("explanation", {})
        
        ws.append([
            idx + 1,
            cand.get("name", "Unknown"),
            cand.get("email", ""),
            cand.get("phone", ""),
            item.get("score", 0),
            item.get("confidence", 0),
            item.get("breakdown", {}).get("semantic", 0),
            item.get("breakdown", {}).get("experience", 0),
            item.get("breakdown", {}).get("skills", 0),
            item.get("breakdown", {}).get("projects", 0),
            expl.get("recommendation", "")
        ])
        
    excel_file = io.BytesIO()
    wb.save(excel_file)
    excel_file.seek(0)
    return excel_file.getvalue()

def generate_pdf_summary_html(scores: list[dict], candidates_map: dict, job_title: str) -> str:
    """Generate a clean HTML layout that can be printed to PDF by the browser."""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Recruiter Candidate Dossier Report - {job_title}</title>
        <style>
            body {{ font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 30px; }}
            h1 {{ color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }}
            h2 {{ color: #2563eb; margin-top: 25px; }}
            .candidate-card {{ border: 1px solid #e5e7eb; padding: 20px; margin-bottom: 20px; border-radius: 8px; background-color: #f9fafb; }}
            .score-badge {{ display: inline-block; padding: 5px 12px; background-color: #3b82f6; color: white; border-radius: 4px; font-weight: bold; }}
            .breakdown {{ margin: 10px 0; font-size: 0.9em; }}
            .list-title {{ font-weight: bold; margin-top: 10px; }}
            ul {{ margin-top: 5px; }}
        </style>
    </head>
    <body>
        <h1>Recruiter Candidate Dossier Report</h1>
        <p><strong>Target Position:</strong> {job_title}</p>
        <p><strong>Total Screened Candidates:</strong> {len(scores)}</p>
        <hr>
    """
    
    for idx, item in enumerate(scores):
        cand_id = item.get("candidateId")
        cand = candidates_map.get(cand_id, {})
        expl = item.get("explanation", {})
        
        html += f"""
        <div class="candidate-card">
            <h2>#{idx+1} {cand.get('name', 'Unknown Candidate')}</h2>
            <p><strong>Email:</strong> {cand.get('email', 'N/A')} | <strong>Phone:</strong> {cand.get('phone', 'N/A')}</p>
            <div>
                <span class="score-badge">Match Score: {item.get('score', 0)}%</span>
                <span class="score-badge" style="background-color: #10b981;">Confidence: {item.get('confidence', 0)}%</span>
            </div>
            
            <div class="breakdown">
                <strong>Scores Breakdown:</strong>
                Semantic: {item.get('breakdown', {}).get('semantic', 0)}% | 
                Experience: {item.get('breakdown', {}).get('experience', 0)}% | 
                Skills: {item.get('breakdown', {}).get('skills', 0)}% | 
                Projects: {item.get('breakdown', {}).get('projects', 0)}%
            </div>
            
            <p><strong>Recommendation Summary:</strong><br>{expl.get('recommendation', 'N/A')}</p>
            
            <div class="list-title">Core Strengths:</div>
            <ul>
        """
        for pro in expl.get("pros", []):
            html += f"<li>{pro}</li>"
            
        html += """
            </ul>
            <div class="list-title">Gaps / Development areas:</div>
            <ul>
        """
        for con in expl.get("cons", []):
            html += f"<li>{con}</li>"
            
        html += """
            </ul>
            <div class="list-title">Tailored Interview Questions:</div>
            <ul>
        """
        for q in expl.get("interviewQuestions", []):
            html += f"<li>{q}</li>"
            
        html += """
            </ul>
        </div>
        """
        
    html += """
    </body>
    </html>
    """
    return html
