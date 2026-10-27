import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Integer, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    status = Column(String(50), default="draft")  # draft, analyzing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    idea = relationship("ProductIdea", back_populates="project", uselist=False, cascade="all, delete-orphan")
    analysis_run = relationship("AnalysisRun", back_populates="project", uselist=False, cascade="all, delete-orphan")
    report = relationship("FeasibilityReport", back_populates="project", uselist=False, cascade="all, delete-orphan")
    financial_assumptions = relationship("FinancialAssumption", back_populates="project", cascade="all, delete-orphan")
    competitors = relationship("Competitor", back_populates="project", cascade="all, delete-orphan")
    personas = relationship("CustomerPersona", back_populates="project", cascade="all, delete-orphan")
    findings = relationship("ResearchFinding", back_populates="project", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="project", cascade="all, delete-orphan")

class ProductIdea(Base):
    __tablename__ = "product_ideas"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    city_region = Column(String(150), nullable=False)
    
    # Optional business parameters
    target_demographic = Column(String(255), nullable=True)
    intended_price = Column(Float, nullable=True)
    estimated_cost = Column(Float, nullable=True)
    startup_budget = Column(Float, nullable=True)
    monthly_expenses = Column(Float, nullable=True)
    distribution_channel = Column(String(100), default="hybrid")
    business_model = Column(String(100), default="B2C")
    target_monthly_sales = Column(Integer, nullable=True)
    usp = Column(Text, nullable=True)
    founder_resources = Column(Text, nullable=True)

    project = relationship("Project", back_populates="idea")

class AnalysisRun(Base):
    __tablename__ = "analysis_runs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    status = Column(String(50), default="pending")  # pending, in_progress, completed, failed
    current_stage = Column(String(100), default="Stage A: Idea Understanding")
    progress_percentage = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    logs = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    project = relationship("Project", back_populates="analysis_run")
