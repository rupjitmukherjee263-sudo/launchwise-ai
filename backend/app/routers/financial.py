from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.financial import FinancialAssumption, FinancialProjection
from app.schemas.financial import FinancialInputs, FinancialReport
from app.services.financial_engine import FinancialEngine

router = APIRouter(prefix="/financial", tags=["Financial Engine"])

@router.post("/simulate", response_model=FinancialReport)
def simulate_financials(inputs: FinancialInputs):
    return FinancialEngine.run_full_model(inputs)

@router.get("/{project_id}", response_model=FinancialReport)
def get_project_financials(project_id: str, db: Session = Depends(get_db)):
    assump = db.query(FinancialAssumption).filter(
        FinancialAssumption.project_id == project_id,
        FinancialAssumption.scenario_name == "base"
    ).first()

    if not assump:
        raise HTTPException(status_code=404, detail="Financial assumptions not found for this project")

    inputs = FinancialInputs(
        selling_price=assump.selling_price,
        variable_cost_per_unit=assump.variable_cost_per_unit,
        fixed_monthly_costs=assump.fixed_monthly_costs,
        initial_startup_investment=assump.initial_startup_investment,
        target_monthly_sales=assump.target_monthly_sales,
        tax_rate=assump.tax_rate
    )
    return FinancialEngine.run_full_model(inputs)

@router.post("/{project_id}/save")
def update_financial_assumptions(project_id: str, inputs: FinancialInputs, db: Session = Depends(get_db)):
    assump = db.query(FinancialAssumption).filter(
        FinancialAssumption.project_id == project_id,
        FinancialAssumption.scenario_name == "base"
    ).first()

    if not assump:
        assump = FinancialAssumption(project_id=project_id, scenario_name="base")
        db.add(assump)

    assump.selling_price = inputs.selling_price
    assump.variable_cost_per_unit = inputs.variable_cost_per_unit
    assump.fixed_monthly_costs = inputs.fixed_monthly_costs
    assump.initial_startup_investment = inputs.initial_startup_investment
    assump.target_monthly_sales = inputs.target_monthly_sales
    assump.tax_rate = inputs.tax_rate

    # Recalculate projections and save
    fin_report = FinancialEngine.run_full_model(inputs)
    
    db.query(FinancialProjection).filter(FinancialProjection.project_id == project_id).delete()
    for mp in fin_report.projections_12_months:
        db_proj = FinancialProjection(
            project_id=project_id,
            scenario_name="base",
            month=mp.month,
            units_sold=mp.units_sold,
            revenue=mp.revenue,
            variable_costs=mp.variable_costs,
            gross_profit=mp.gross_profit,
            fixed_costs=mp.fixed_costs,
            operating_profit=mp.operating_profit,
            net_profit=mp.net_profit,
            cumulative_cash_flow=mp.cumulative_cash_flow
        )
        db.add(db_proj)

    db.commit()
    return {"message": "Financial assumptions updated and projections recalculated successfully"}
