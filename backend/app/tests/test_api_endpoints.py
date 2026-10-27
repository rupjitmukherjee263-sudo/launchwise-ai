import pytest
from fastapi import BackgroundTasks

import app.models
from app.database import Base, engine, SessionLocal
from app.routers.health import get_system_health
from app.routers.projects import list_samples, create_project, get_project, list_projects
from app.routers.financial import simulate_financials, get_project_financials, update_financial_assumptions
from app.routers.competitors import get_project_competitors
from app.routers.reports import get_feasibility_report, export_report_pdf, export_financial_csv, export_competitors_csv
from app.schemas.financial import FinancialInputs
from app.schemas.project import ProjectCreate, ProductIdeaCreate
from app.main import seed_demo_cases

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    seed_demo_cases(session)
    yield session
    session.close()

def test_health_endpoint():
    data = get_system_health()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "llm_provider" in data
    assert "is_demo_mode" in data

def test_list_samples_endpoint():
    samples = list_samples()
    assert len(samples) >= 2
    assert any("bangalore_cafe" in s["id"] for s in samples)
    assert any("mumbai_kombucha" in s["id"] for s in samples)

def test_financial_simulate_endpoint():
    payload = FinancialInputs(
        selling_price=300.0,
        variable_cost_per_unit=80.0,
        fixed_monthly_costs=90000.0,
        initial_startup_investment=800000.0,
        target_monthly_sales=1200,
        tax_rate=0.18
    )
    report = simulate_financials(payload)
    assert report.unit_economics.contribution_per_unit == 220.0
    assert report.break_even.break_even_units == 410
    assert report.base_scenario.annual_revenue > 0
    assert len(report.projections_12_months) == 12

def test_project_crud_and_exports(db):
    # 1. Test Project Creation
    req = ProjectCreate(
        name="Artisan Sourdough Bakery",
        idea=ProductIdeaCreate(
            title="Artisan Sourdough Bakery",
            description="Organic artisanal sourdough bakery in Koregaon Park Pune.",
            category="Food & Beverage",
            country="India",
            city_region="Koregaon Park, Pune",
            intended_price=180.0,
            estimated_cost=45.0,
            startup_budget=1000000.0,
            monthly_expenses=120000.0,
            target_monthly_sales=2000
        )
    )
    bg = BackgroundTasks()
    proj = create_project(req, bg, db)
    assert proj.id is not None
    assert proj.name == "Artisan Sourdough Bakery"

    # 2. Test Get Project
    fetched = get_project(proj.id, db)
    assert fetched.id == proj.id
    assert fetched.idea.title == "Artisan Sourdough Bakery"

    # 3. Test Demo Project Reports
    demo_id = "demo-bangalore_cafe"
    report_dict = get_feasibility_report(demo_id, db)
    assert report_dict["recommendation"] in ["LAUNCH", "LAUNCH SMALL PILOT"]
    assert report_dict["viability_score"] > 80.0
    assert "sections_data" in report_dict

    # 4. Test PDF Export
    pdf_resp = export_report_pdf(demo_id, db)
    assert pdf_resp.media_type == "application/pdf"
    assert len(pdf_resp.body) > 1000

    # 5. Test Financial CSV Export
    csv_resp = export_financial_csv(demo_id, db)
    assert csv_resp.media_type == "text/csv"
    assert "Month,Units Sold,Revenue" in csv_resp.body.decode("utf-8")

    # 6. Test Competitors CSV Export & Retrieval
    comps = get_project_competitors(demo_id, db)
    assert len(comps) >= 2
    comp_csv = export_competitors_csv(demo_id, db)
    assert "Competitor Name,Category" in comp_csv.body.decode("utf-8")

    # 7. Test Financial Assumptions Update & Recalculation
    update_inputs = FinancialInputs(
        selling_price=310.0,
        variable_cost_per_unit=75.0,
        fixed_monthly_costs=250000.0,
        initial_startup_investment=2200000.0,
        target_monthly_sales=2100,
        tax_rate=0.18
    )
    res = update_financial_assumptions(demo_id, update_inputs, db)
    assert "updated" in res["message"].lower()

    # Verify updated model
    recalculated = get_project_financials(demo_id, db)
    assert recalculated.unit_economics.selling_price == 310.0
