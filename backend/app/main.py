from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime

import app.models
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import (
    health_router, projects_router, analysis_router,
    financial_router, competitors_router, reports_router, chat_router
)
from app.models.project import Project, ProductIdea, AnalysisRun
from app.models.competitor import Competitor
from app.models.customer import CustomerPersona
from app.models.research import ResearchFinding
from app.models.financial import FinancialAssumption, FinancialProjection
from app.models.report import FeasibilityReport
from app.schemas.financial import FinancialInputs
from app.services.financial_engine import FinancialEngine
from app.services.sample_cases import SAMPLE_CASES

def seed_demo_cases(db):
    count = db.query(Project).count()
    if count > 0:
        return

    print("Seeding demo projects for instant exploration...")
    for key, data in SAMPLE_CASES.items():
        proj_id = f"demo-{key}"
        proj = Project(
            id=proj_id,
            name=f"{data['title']} - {data['city_region']}",
            status="completed"
        )
        db.add(proj)

        idea = ProductIdea(
            id=f"idea-{key}",
            project_id=proj_id,
            title=data['title'],
            description=data['description'],
            category=data['category'],
            country=data['country'],
            city_region=data['city_region'],
            target_demographic=data.get('target_demographic'),
            intended_price=data.get('intended_price'),
            estimated_cost=data.get('estimated_cost'),
            startup_budget=data.get('startup_budget'),
            monthly_expenses=data.get('monthly_expenses'),
            target_monthly_sales=data.get('target_monthly_sales'),
            distribution_channel=data.get('distribution_channel', 'hybrid'),
            business_model=data.get('business_model', 'B2C'),
            usp=data.get('usp'),
            founder_resources=data.get('founder_resources')
        )
        db.add(idea)

        run = AnalysisRun(
            project_id=proj_id,
            status="completed",
            current_stage="Stage I: Synthesis Complete",
            progress_percentage=100,
            completed_at=datetime.utcnow(),
            logs=[
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage A: Idea Understanding", "message": "Extracted problem, target demographic, and revenue model"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage B: Market Research", "message": "Benchmarked TAM/SAM/SOM and industry growth indicators"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage C: Competitor Discovery", "message": f"Identified local competitors in {data['city_region']}"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage D: Customer Personas", "message": "Constructed customer archetypes and unmet pain points"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage E: Pricing Strategy", "message": "Derived value-based pricing tiers and positioning"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage F: Financial Modeling", "message": "Computed deterministic 12-month projections and break-even"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage G & H: Risks & GTM", "message": "Drafted 30-60-90 day validation roadmap"},
                {"timestamp": datetime.utcnow().isoformat(), "stage": "Stage I: Synthesis Complete", "message": "Feasibility report generated with evidence-backed recommendation"}
            ]
        )
        db.add(run)

        # Seed competitors
        for c in data.get('competitors', []):
            db.add(Competitor(
                project_id=proj_id,
                name=c['name'],
                category=c.get('category', 'direct'),
                location=c.get('location'),
                address=c.get('address'),
                latitude=c.get('latitude'),
                longitude=c.get('longitude'),
                source_url=c.get('source_url'),
                pricing_summary=c.get('pricing_summary'),
                est_price=c.get('est_price'),
                strengths=c.get('strengths', []),
                weaknesses=c.get('weaknesses', []),
                offerings=c.get('offerings', []),
                market_gaps=c.get('market_gaps', []),
                is_verified=c.get('is_verified', True),
                verification_source=c.get('verification_source', 'Verified Local Intelligence')
            ))

        # Seed personas
        for p in data.get('personas', []):
            db.add(CustomerPersona(
                project_id=proj_id,
                name=p['name'],
                demographics=p['demographics'],
                core_problems=p['core_problems'],
                purchasing_motivations=p['purchasing_motivations'],
                budget_sensitivity=p.get('budget_sensitivity', 'Moderate'),
                preferred_channels=p.get('preferred_channels', []),
                rejection_reasons=p.get('rejection_reasons', []),
                is_observed=p.get('is_observed', True),
                sample_quote=p.get('sample_quote')
            ))

        # Seed financial model
        price = float(data.get('intended_price', 280.0))
        cost = float(data.get('estimated_cost', 72.0))
        fixed = float(data.get('monthly_expenses', 240000.0))
        investment = float(data.get('startup_budget', 2000000.0))
        sales = int(data.get('target_monthly_sales', 2000))
        
        fin_inputs = FinancialInputs(
            selling_price=price,
            variable_cost_per_unit=cost,
            fixed_monthly_costs=fixed,
            initial_startup_investment=investment,
            target_monthly_sales=sales,
            tax_rate=0.18
        )
        fin_report = FinancialEngine.run_full_model(fin_inputs)

        db.add(FinancialAssumption(
            project_id=proj_id,
            scenario_name="base",
            selling_price=price,
            variable_cost_per_unit=cost,
            fixed_monthly_costs=fixed,
            initial_startup_investment=investment,
            target_monthly_sales=sales,
            tax_rate=0.18
        ))

        for mp in fin_report.projections_12_months:
            db.add(FinancialProjection(
                project_id=proj_id,
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
            ))

        # Seed feasibility report
        rec = "LAUNCH SMALL PILOT" if investment > 1200000 else "LAUNCH"
        sections = {
            "1_executive_summary": f"{data['title']} presents a compelling commercial proposition in {data['city_region']}, addressing surging demand for verified high-craft quality in {data['category']}. With a healthy {fin_report.unit_economics.contribution_margin_pct}% gross contribution margin, operations achieve break-even at {fin_report.break_even.break_even_units} monthly units against a steady-state capacity of {sales} units.",
            "2_product_overview": f"Product: {data['title']}. Location: {data['city_region']}, {data['country']}. Model: {data.get('business_model', 'B2C')}. USP: {data.get('usp')}.",
            "3_feasibility_recommendation": {
                "verdict": rec,
                "viability_score": 83.5,
                "confidence_score": 88.0,
                "rationale": f"High gross contribution margin ({fin_report.unit_economics.contribution_margin_pct}%) and verified customer density in {data['city_region']}. Recommend testing with a pop-up validation batch prior to full commercial lease lock-in."
            },
            "4_market_demand_trends": "Strong secular expansion in urban specialty consumer goods with 17.5% regional CAGR and high consumer willingness to trade up for ethical provenance.",
            "5_market_sizing": {
                "tam": "INR 18,200 Crores (National Category Market)",
                "sam": "INR 840 Crores (Tier-1 Metro Catchment)",
                "som": f"INR 4.2 Crores (3-Year Local Capture in {data['city_region']})",
                "methodology": "Bottom-up catchment analysis: 240,000 residents in 5km radius, 12% target penetration, INR 14,500 average annual consumer spend."
            },
            "6_local_market_analysis": f"Catchment in {data['city_region']} exhibits dense pedestrian footfall, tech/corporate cluster concentration, high digital literacy, offset by premium commercial rental rates.",
            "7_competitor_comparison": [
                {
                    "name": c['name'],
                    "category": c.get('category', 'direct'),
                    "est_price": c.get('est_price', 0.0),
                    "verified": c.get('is_verified', True),
                    "strengths": c.get('strengths', []),
                    "weaknesses": c.get('weaknesses', []),
                    "market_gaps": c.get('market_gaps', [])
                }
                for c in data.get('competitors', [])
            ],
            "8_customer_personas": [
                {
                    "name": p['name'],
                    "demographics": p['demographics'],
                    "core_problems": p['core_problems'],
                    "motivations": p['purchasing_motivations'],
                    "budget_sensitivity": p.get('budget_sensitivity', 'Moderate'),
                    "is_observed": True
                }
                for p in data.get('personas', [])
            ],
            "9_differentiation_gaps": [
                "Direct single-estate lot traceability",
                "Acoustically treated quiet zones for deep work",
                "Clean label formulations with zero synthetic additives"
            ],
            "10_pricing_positioning": {
                "budget_tier": round(price * 0.85, 2),
                "recommended_launch_price": round(price, 2),
                "premium_tier": round(price * 1.35, 2),
                "gross_margin_pct": fin_report.unit_economics.contribution_margin_pct,
                "positioning_statement": f"Premium artisanal craft and transparent provenance in {data['city_region']} without mass-chain compromise."
            },
            "11_startup_budget": {
                "initial_capital_required": investment,
                "equipment_fitouts": round(investment * 0.45, 2),
                "lease_security_advance": round(investment * 0.25, 2),
                "working_capital_reserve": round(investment * 0.20, 2),
                "branding_licensing_launch": round(investment * 0.10, 2)
            },
            "12_financial_forecasts": {
                "year1_revenue": fin_report.base_scenario.annual_revenue,
                "year1_operating_profit": fin_report.base_scenario.annual_operating_profit,
                "year1_net_profit": fin_report.base_scenario.annual_net_profit,
                "annual_roi_pct": fin_report.base_scenario.roi_annual_pct or 0.0,
                "payback_period_months": fin_report.base_scenario.payback_months or 0.0
            },
            "13_break_even_analysis": {
                "break_even_units_monthly": fin_report.break_even.break_even_units,
                "break_even_revenue_monthly": fin_report.break_even.break_even_revenue,
                "contribution_per_unit": fin_report.unit_economics.contribution_per_unit,
                "is_attainable": fin_report.break_even.is_attainable
            },
            "14_scenario_comparison": {
                "conservative": {
                    "annual_revenue": fin_report.conservative_scenario.annual_revenue,
                    "annual_net_profit": fin_report.conservative_scenario.annual_net_profit,
                    "break_even_units": fin_report.conservative_scenario.break_even_units
                },
                "base": {
                    "annual_revenue": fin_report.base_scenario.annual_revenue,
                    "annual_net_profit": fin_report.base_scenario.annual_net_profit,
                    "break_even_units": fin_report.base_scenario.break_even_units
                },
                "optimistic": {
                    "annual_revenue": fin_report.optimistic_scenario.annual_revenue,
                    "annual_net_profit": fin_report.optimistic_scenario.annual_net_profit,
                    "break_even_units": fin_report.optimistic_scenario.break_even_units
                }
            },
            "15_marketing_acquisition": [
                "Geo-fenced social advertising targeting local office workers",
                "Weekend curated tasting sessions for local creators",
                "Corporate workspace subscription partnerships"
            ],
            "16_operational_requirements": [
                "Commercial equipment procurement with 2-year AMC warranty",
                "Cold-chain storage and inventory staging",
                "Standardized staff operating procedures and weekly quality calibration"
            ],
            "17_regulatory_compliance": [
                "FSSAI Food Safety License",
                "Municipal Trade License & Shop Act registration",
                "GST Registration & Fire Department NOC"
            ],
            "18_risk_assessment": [
                {
                    "risk": "High fixed lease overheads",
                    "severity": "High",
                    "likelihood": "Moderate",
                    "evidence": "Commercial lease security deposits demand 6-10 months rent advance.",
                    "mitigation": "Negotiate initial 6-month rent step-up or revenue-share lease structure."
                },
                {
                    "risk": "Incumbent promotional discounting",
                    "severity": "Moderate",
                    "likelihood": "High",
                    "evidence": "Incumbent chains run aggressive 30% loyalty app promotions.",
                    "mitigation": "Differentiate strictly on single-origin craft and quiet environment rather than price discounting."
                }
            ],
            "19_execution_roadmap": {
                "days_0_30": "Finalize bean and packaging suppliers, apply for trade licenses, blind taste-test 50 local consumers.",
                "days_31_60": "Fit-out and equipment testing, recruit core team, launch social waitlist campaign.",
                "days_61_90": "Soft launch for beta waitlist, launch local corporate delivery perks, optimize workflow."
            },
            "20_validation_experiments": [
                "Host a 3-day pop-up stand at a weekend organic market to test price tolerance at target price.",
                "Distribute 100 sample trial packs with QR-code survey to measure repeat intent vs incumbent brands.",
                "Pre-sell 50 founders passes to validate upfront commitment."
            ],
            "21_assumptions_limitations": [
                "Projections assume commodity ingredient prices remain within a ±8% variance range.",
                "Footfall estimates depend on local street accessibility and municipal parking regulations.",
                "Personas combine observed customer reviews with demographic inferences."
            ],
            "22_sources_citations": [
                {"title": "Statista & Coffee Board of India Report", "publisher": "Statista", "url": "https://www.statista.com", "retrieved": datetime.utcnow().strftime("%Y-%m-%d")},
                {"title": "ANAROCK Retail Real Estate Index", "publisher": "ANAROCK Research", "url": "https://www.anarock.com", "retrieved": datetime.utcnow().strftime("%Y-%m-%d")}
            ]
        }

        db.add(FeasibilityReport(
            project_id=proj_id,
            recommendation=rec,
            viability_score=83.5,
            confidence_score=88.0,
            confidence_rationale=sections["3_feasibility_recommendation"]["rationale"],
            executive_summary=sections["1_executive_summary"],
            sections_data=sections
        ))

    db.commit()
    print("Demo projects seeded successfully!")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create tables
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed initial demo projects synchronously in 0.05 seconds
    db = SessionLocal()
    try:
        seed_demo_cases(db)
    finally:
        db.close()
    
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="LaunchWise AI — Product Launch Intelligence & Business Feasibility Agent",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(analysis_router, prefix=settings.API_V1_STR)
app.include_router(financial_router, prefix=settings.API_V1_STR)
app.include_router(competitors_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs_url": "/docs"
    }
