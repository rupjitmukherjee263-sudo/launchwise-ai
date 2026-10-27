import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project, ProductIdea, AnalysisRun
from app.schemas.project import ProjectCreate, ProjectResponse
from app.services.sample_cases import SAMPLE_CASES
from app.services.pipeline_orchestrator import PipelineOrchestrator

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    return projects

@router.get("/samples")
def list_samples():
    return [
        {
            "id": k,
            "title": v["title"],
            "category": v["category"],
            "city_region": v["city_region"],
            "country": v["country"],
            "description": v["description"],
            "intended_price": v.get("intended_price"),
            "estimated_cost": v.get("estimated_cost"),
            "startup_budget": v.get("startup_budget"),
            "monthly_expenses": v.get("monthly_expenses"),
            "target_monthly_sales": v.get("target_monthly_sales"),
            "distribution_channel": v.get("distribution_channel"),
            "business_model": v.get("business_model"),
            "usp": v.get("usp")
        }
        for k, v in SAMPLE_CASES.items()
    ]

@router.post("", response_model=ProjectResponse)
def create_project(data: ProjectCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    proj_id = str(uuid.uuid4())
    project = Project(
        id=proj_id,
        name=data.name,
        status="draft"
    )
    db.add(project)

    idea_data = data.idea
    idea = ProductIdea(
        id=str(uuid.uuid4()),
        project_id=proj_id,
        title=idea_data.title,
        description=idea_data.description,
        category=idea_data.category,
        country=idea_data.country,
        city_region=idea_data.city_region,
        target_demographic=idea_data.target_demographic,
        intended_price=idea_data.intended_price,
        estimated_cost=idea_data.estimated_cost,
        startup_budget=idea_data.startup_budget,
        monthly_expenses=idea_data.monthly_expenses,
        distribution_channel=idea_data.distribution_channel,
        business_model=idea_data.business_model,
        target_monthly_sales=idea_data.target_monthly_sales,
        usp=idea_data.usp,
        founder_resources=idea_data.founder_resources
    )
    db.add(idea)

    # Initialize analysis run
    run = AnalysisRun(
        project_id=proj_id,
        status="pending",
        progress_percentage=0,
        current_stage="Stage A: Idea Understanding"
    )
    db.add(run)

    db.commit()
    db.refresh(project)
    return project

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully", "id": project_id}
