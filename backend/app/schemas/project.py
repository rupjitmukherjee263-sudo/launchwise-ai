from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ProductIdeaCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=10)
    category: str = Field(..., min_length=2, max_length=100)
    country: str = Field(..., min_length=2, max_length=100)
    city_region: str = Field(..., min_length=2, max_length=150)
    
    # Optional fields
    target_demographic: Optional[str] = None
    intended_price: Optional[float] = None
    estimated_cost: Optional[float] = None
    startup_budget: Optional[float] = None
    monthly_expenses: Optional[float] = None
    distribution_channel: Optional[str] = "hybrid"
    business_model: Optional[str] = "B2C"
    target_monthly_sales: Optional[int] = None
    usp: Optional[str] = None
    founder_resources: Optional[str] = None

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    idea: ProductIdeaCreate

class ProductIdeaResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    country: str
    city_region: str
    target_demographic: Optional[str] = None
    intended_price: Optional[float] = None
    estimated_cost: Optional[float] = None
    startup_budget: Optional[float] = None
    monthly_expenses: Optional[float] = None
    distribution_channel: Optional[str] = "hybrid"
    business_model: Optional[str] = "B2C"
    target_monthly_sales: Optional[int] = None
    usp: Optional[str] = None
    founder_resources: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    id: str
    name: str
    status: str
    created_at: datetime
    updated_at: datetime
    idea: Optional[ProductIdeaResponse] = None

    class Config:
        from_attributes = True

class AnalysisStatusResponse(BaseModel):
    project_id: str
    status: str
    current_stage: str
    progress_percentage: int
    error_message: Optional[str] = None
    logs: List[Dict[str, Any]] = []
    completed_at: Optional[datetime] = None
