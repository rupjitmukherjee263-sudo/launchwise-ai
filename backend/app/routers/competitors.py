from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.competitor import Competitor

router = APIRouter(prefix="/competitors", tags=["Competitor Intelligence"])

@router.get("/{project_id}")
def get_project_competitors(project_id: str, db: Session = Depends(get_db)):
    competitors = db.query(Competitor).filter(Competitor.project_id == project_id).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "category": c.category,
            "location": c.location,
            "address": c.address,
            "latitude": c.latitude,
            "longitude": c.longitude,
            "source_url": c.source_url,
            "pricing_summary": c.pricing_summary,
            "est_price": c.est_price,
            "strengths": c.strengths or [],
            "weaknesses": c.weaknesses or [],
            "offerings": c.offerings or [],
            "market_gaps": c.market_gaps or [],
            "is_verified": c.is_verified,
            "verification_source": c.verification_source
        }
        for c in competitors
    ]
