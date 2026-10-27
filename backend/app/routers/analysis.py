from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models.project import Project, AnalysisRun
from app.schemas.project import AnalysisStatusResponse
from app.services.pipeline_orchestrator import PipelineOrchestrator

router = APIRouter(prefix="/analysis", tags=["Research & Analysis Pipeline"])

async def run_pipeline_task(project_id: str):
    db = SessionLocal()
    try:
        await PipelineOrchestrator.run_pipeline(project_id, db)
    finally:
        db.close()

@router.post("/{project_id}/start")
async def start_analysis(project_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    run = db.query(AnalysisRun).filter(AnalysisRun.project_id == project_id).first()
    if not run:
        run = AnalysisRun(project_id=project_id, status="in_progress")
        db.add(run)
    else:
        run.status = "in_progress"
        run.progress_percentage = 5
        run.error_message = None
    
    project.status = "analyzing"
    db.commit()

    background_tasks.add_task(run_pipeline_task, project_id)
    return {"message": "Analysis pipeline launched in background", "project_id": project_id}

@router.get("/{project_id}/status", response_model=AnalysisStatusResponse)
def get_analysis_status(project_id: str, db: Session = Depends(get_db)):
    run = db.query(AnalysisRun).filter(AnalysisRun.project_id == project_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Analysis run not found")
    
    return AnalysisStatusResponse(
        project_id=run.project_id,
        status=run.status,
        current_stage=run.current_stage,
        progress_percentage=run.progress_percentage,
        error_message=run.error_message,
        logs=run.logs or [],
        completed_at=run.completed_at
    )
