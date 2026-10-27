import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.project import Project
from app.models.report import FeasibilityReport
from app.models.financial import FinancialAssumption
from app.models.chat import ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.financial import FinancialInputs
from app.services.financial_engine import FinancialEngine
from app.services.llm_adapter import LLMAdapter

router = APIRouter(prefix="/chat", tags=["AI Chat Assistant"])

@router.post("", response_model=ChatResponse)
async def chat_with_assistant(req: ChatRequest, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == req.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    report = db.query(FeasibilityReport).filter(FeasibilityReport.project_id == req.project_id).first()
    assump = db.query(FinancialAssumption).filter(
        FinancialAssumption.project_id == req.project_id,
        FinancialAssumption.scenario_name == "base"
    ).first()

    # Save user message
    user_msg = ChatMessage(
        project_id=req.project_id,
        role="user",
        content=req.message
    )
    db.add(user_msg)

    # Check for numerical simulation intent
    sim_triggered = False
    sim_data = None
    prompt_lower = req.message.lower()

    if assump and ("price" in prompt_lower and ("reduce" in prompt_lower or "drop" in prompt_lower or "cut" in prompt_lower or "%" in prompt_lower)):
        # Extract percentage if any
        match = re.search(r"(\d+)%", prompt_lower)
        pct = float(match.group(1)) if match else 15.0
        new_price = max(1.0, assump.selling_price * (1.0 - (pct / 100.0)))
        
        sim_inputs = FinancialInputs(
            selling_price=new_price,
            variable_cost_per_unit=assump.variable_cost_per_unit,
            fixed_monthly_costs=assump.fixed_monthly_costs,
            initial_startup_investment=assump.initial_startup_investment,
            target_monthly_sales=assump.target_monthly_sales,
            tax_rate=assump.tax_rate
        )
        sim_res = FinancialEngine.run_full_model(sim_inputs)
        sim_triggered = True
        math_orig_be = round(assump.fixed_monthly_costs / max(1.0, assump.selling_price - assump.variable_cost_per_unit))
        sim_data = {
            "type": "price_reduction",
            "original_price": assump.selling_price,
            "simulated_price": round(new_price, 2),
            "original_break_even": math_orig_be,
            "simulated_break_even": sim_res.break_even.break_even_units,
            "original_annual_net": round(assump.target_monthly_sales * (assump.selling_price - assump.variable_cost_per_unit) * 12 - (assump.fixed_monthly_costs * 12), 2),
            "simulated_annual_net": sim_res.base_scenario.annual_net_profit
        }

    elif assump and ("sales" in prompt_lower and ("half" in prompt_lower or "50%" in prompt_lower or "drop" in prompt_lower)):
        new_units = max(1, int(assump.target_monthly_sales * 0.5))
        sim_inputs = FinancialInputs(
            selling_price=assump.selling_price,
            variable_cost_per_unit=assump.variable_cost_per_unit,
            fixed_monthly_costs=assump.fixed_monthly_costs,
            initial_startup_investment=assump.initial_startup_investment,
            target_monthly_sales=new_units,
            tax_rate=assump.tax_rate
        )
        sim_res = FinancialEngine.run_full_model(sim_inputs)
        sim_triggered = True
        sim_data = {
            "type": "sales_drop",
            "original_units": assump.target_monthly_sales,
            "simulated_units": new_units,
            "simulated_annual_revenue": sim_res.base_scenario.annual_revenue,
            "simulated_annual_net": sim_res.base_scenario.annual_net_profit,
            "cash_runway_months": sim_res.base_scenario.cash_runway_months
        }

    # Context assembly for LLM
    idea_desc = project.idea.description if project.idea else ""
    idea_cat = project.idea.category if project.idea else ""
    idea_loc = project.idea.city_region if project.idea else ""
    context_parts = [
        f"Project Name: {project.name}",
        f"Idea: {idea_desc}",
        f"Category: {idea_cat}",
        f"Location: {idea_loc}"
    ]
    if report:
        context_parts.append(f"Recommendation: {report.recommendation}")
        context_parts.append(f"Viability Score: {report.viability_score}/100")
        context_parts.append(f"Executive Summary: {report.executive_summary}")
    if assump:
        context_parts.append(f"Base Price: {assump.selling_price}, Unit Cost: {assump.variable_cost_per_unit}, Fixed Costs: {assump.fixed_monthly_costs}")
    if sim_data:
        context_parts.append(f"Deterministic Simulation Results: {sim_data}")

    context_str = "\n".join(context_parts)
    answer = await LLMAdapter.chat_response(req.message, context_str)

    # Save assistant message
    asst_msg = ChatMessage(
        project_id=req.project_id,
        role="assistant",
        content=answer,
        simulation_params={"triggered": sim_triggered},
        simulation_result=sim_data
    )
    db.add(asst_msg)
    db.commit()
    db.refresh(asst_msg)

    return ChatResponse(
        id=asst_msg.id,
        role=asst_msg.role,
        content=asst_msg.content,
        simulation_triggered=sim_triggered,
        simulation_data=sim_data,
        timestamp=asst_msg.created_at
    )

@router.get("/{project_id}")
def get_chat_history(project_id: str, db: Session = Depends(get_db)):
    msgs = db.query(ChatMessage).filter(ChatMessage.project_id == project_id).order_by(ChatMessage.created_at).all()
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "simulation_triggered": bool(m.simulation_result),
            "simulation_data": m.simulation_result,
            "timestamp": m.created_at
        }
        for m in msgs
    ]
