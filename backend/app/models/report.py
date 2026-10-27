import uuid
from datetime import datetime
from sqlalchemy import Column, String, ForeignKey, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class FeasibilityReport(Base):
    __tablename__ = "feasibility_reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    recommendation = Column(String(50), nullable=False) # LAUNCH, LAUNCH SMALL PILOT, MODIFY AND VALIDATE, HOLD / AVOID INVESTING YET
    viability_score = Column(Float, nullable=False) # 0 to 100
    confidence_score = Column(Float, nullable=False) # 0 to 100
    confidence_rationale = Column(Text, nullable=False)
    executive_summary = Column(Text, nullable=False)
    
    # Complete 22-section structured report data
    sections_data = Column(JSON, nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    project = relationship("Project", back_populates="report")
