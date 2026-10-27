from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.models.report import FeasibilityReport
from app.models.competitor import Competitor
from app.models.financial import FinancialProjection
from app.services.export_service import ReportExportService

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])

@router.get("/{project_id}")
def get_feasibility_report(project_id: str, db: Session = Depends(get_db)):
    report = db.query(FeasibilityReport).filter(FeasibilityReport.project_id == project_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Feasibility report not found for this project")

    return {
        "id": report.id,
        "project_id": report.project_id,
        "recommendation": report.recommendation,
        "viability_score": report.viability_score,
        "confidence_score": report.confidence_score,
        "confidence_rationale": report.confidence_rationale,
        "executive_summary": report.executive_summary,
        "sections_data": report.sections_data,
        "created_at": report.created_at,
        "updated_at": report.updated_at
    }

@router.get("/{project_id}/export/pdf")
def export_report_pdf(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    report = db.query(FeasibilityReport).filter(FeasibilityReport.project_id == project_id).first()
    if not project or not report:
        raise HTTPException(status_code=404, detail="Project or report not found")

    rep_dict = {
        "recommendation": report.recommendation,
        "viability_score": report.viability_score,
        "confidence_score": report.confidence_score,
        "executive_summary": report.executive_summary,
        "sections_data": report.sections_data
    }
    
    pdf_buffer = ReportExportService.generate_pdf(project.name, rep_dict, {})
    return Response(
        content=pdf_buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="LaunchWise_{project_id}.pdf"'}
    )

@router.get("/{project_id}/export/financial-csv")
def export_financial_csv(project_id: str, db: Session = Depends(get_db)):
    projections = db.query(FinancialProjection).filter(FinancialProjection.project_id == project_id).order_by(FinancialProjection.month).all()
    if not projections:
        raise HTTPException(status_code=404, detail="No financial projections found")

    csv_data = ReportExportService.generate_financial_csv(projections)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="Financial_Projections_{project_id}.csv"'}
    )

@router.get("/{project_id}/export/competitors-csv")
def export_competitors_csv(project_id: str, db: Session = Depends(get_db)):
    competitors = db.query(Competitor).filter(Competitor.project_id == project_id).all()
    if not competitors:
        raise HTTPException(status_code=404, detail="No competitors found")

    csv_data = ReportExportService.generate_competitors_csv(competitors)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="Competitor_Matrix_{project_id}.csv"'}
    )
