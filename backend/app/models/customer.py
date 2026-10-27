import uuid
from sqlalchemy import Column, String, ForeignKey, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from app.database import Base

class CustomerPersona(Base):
    __tablename__ = "customer_personas"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String(150), nullable=False)
    demographics = Column(String(255), nullable=False)
    core_problems = Column(JSON, default=list)
    purchasing_motivations = Column(JSON, default=list)
    budget_sensitivity = Column(String(50), default="Moderate") # High, Moderate, Low
    preferred_channels = Column(JSON, default=list)
    rejection_reasons = Column(JSON, default=list)
    is_observed = Column(Boolean, default=False)
    sample_quote = Column(Text, nullable=True)

    project = relationship("Project", back_populates="personas")
