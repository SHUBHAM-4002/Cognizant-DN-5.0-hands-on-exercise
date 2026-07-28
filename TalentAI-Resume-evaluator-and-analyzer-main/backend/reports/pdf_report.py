from backend.reports.exporter import generate_pdf_summary_html

def generate_pdf_report_html(scores: list[dict], candidates_map: dict, job_title: str) -> str:
    """Delegates to generate_pdf_summary_html for HTML to PDF printing."""
    return generate_pdf_summary_html(scores, candidates_map, job_title)
