import uuid
from sqlalchemy import Column, String, ForeignKey, Float, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), default="direct") # direct, indirect, substitute
    location = Column(String(255), nullable=True)
    address = Column(String(300), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    source_url = Column(String(500), nullable=True)
    pricing_summary = Column(String(255), nullable=True)
    est_price = Column(Float, nullable=True)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    offerings = Column(JSON, default=list)
    market_gaps = Column(JSON, default=list)
    is_verified = Column(Boolean, default=False)
    verification_source = Column(String(100), default="Places API")

    project = relationship("Project", back_populates="competitors")
