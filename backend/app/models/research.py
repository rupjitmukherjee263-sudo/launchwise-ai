import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class ResearchFinding(Base):
    __tablename__ = "research_findings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    source_url = Column(String(500), nullable=True)
    publisher = Column(String(150), nullable=True)
    snippet = Column(Text, nullable=False)
    category = Column(String(100), default="market_demand") # market_demand, industry_growth, regulatory, pricing
    is_verified = Column(Boolean, default=True)
    evidence_type = Column(String(50), default="observed_fact") # observed_fact, statistical_estimate, hypothesis
    retrieved_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="findings")
