import uuid
from sqlalchemy import Column, String, ForeignKey, Float, Integer
from sqlalchemy.orm import relationship
from app.database import Base

class FinancialAssumption(Base):
    __tablename__ = "financial_assumptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    scenario_name = Column(String(50), default="base") # conservative, base, optimistic
    selling_price = Column(Float, nullable=False)
    variable_cost_per_unit = Column(Float, nullable=False)
    fixed_monthly_costs = Column(Float, nullable=False)
    initial_startup_investment = Column(Float, nullable=False)
    target_monthly_sales = Column(Integer, nullable=False)
    tax_rate = Column(Float, default=0.18) # 18% corporate/GST proxy

    project = relationship("Project", back_populates="financial_assumptions")

class FinancialProjection(Base):
    __tablename__ = "financial_projections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    scenario_name = Column(String(50), default="base")
    month = Column(Integer, nullable=False) # 1 to 12
    units_sold = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    variable_costs = Column(Float, nullable=False)
    gross_profit = Column(Float, nullable=False)
    fixed_costs = Column(Float, nullable=False)
    operating_profit = Column(Float, nullable=False)
    net_profit = Column(Float, nullable=False)
    cumulative_cash_flow = Column(Float, nullable=False)
