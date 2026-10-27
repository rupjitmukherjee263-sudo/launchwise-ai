from typing import List, Optional
from pydantic import BaseModel, Field

class FinancialInputs(BaseModel):
    selling_price: float = Field(..., gt=0, description="Intended selling price per unit")
    variable_cost_per_unit: float = Field(..., ge=0, description="Direct cost to produce/procure one unit")
    fixed_monthly_costs: float = Field(..., ge=0, description="Fixed overhead (rent, baseline salaries, SaaS, insurance)")
    initial_startup_investment: float = Field(..., ge=0, description="CapEx for launch (fit-out, licenses, initial inventory)")
    target_monthly_sales: int = Field(..., gt=0, description="Expected monthly steady-state volume in units")
    tax_rate: float = Field(0.18, ge=0.0, le=0.5, description="Effective tax rate (default 18%)")

class UnitEconomics(BaseModel):
    selling_price: float
    variable_cost_per_unit: float
    contribution_per_unit: float
    contribution_margin_pct: float
    gross_margin_status: str

class BreakEvenAnalysis(BaseModel):
    break_even_units: int
    break_even_revenue: float
    target_monthly_sales: int
    is_attainable: bool
    margin_of_safety_units: int
    margin_of_safety_pct: float

class MonthlyProjection(BaseModel):
    month: int
    units_sold: int
    revenue: float
    variable_costs: float
    gross_profit: float
    fixed_costs: float
    operating_profit: float
    tax_amount: float
    net_profit: float
    cumulative_cash_flow: float

class ScenarioMetrics(BaseModel):
    scenario_name: str
    annual_units: int
    annual_revenue: float
    annual_variable_costs: float
    annual_gross_profit: float
    annual_fixed_costs: float
    annual_operating_profit: float
    annual_net_profit: float
    break_even_units: int
    break_even_revenue: float
    roi_annual_pct: Optional[float]
    cash_runway_months: Optional[float]
    payback_months: Optional[float]

class FinancialReport(BaseModel):
    unit_economics: UnitEconomics
    break_even: BreakEvenAnalysis
    conservative_scenario: ScenarioMetrics
    base_scenario: ScenarioMetrics
    optimistic_scenario: ScenarioMetrics
    projections_12_months: List[MonthlyProjection]
    methodology_notes: List[str]
