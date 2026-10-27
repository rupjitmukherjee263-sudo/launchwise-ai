# LaunchWise AI — Product Launch Intelligence Agent

> **"Know Your Market Before You Invest."**  
> An intelligent business feasibility and localized product launch planning platform.  
> **Core Principle: Research first. Calculate second. Recommend with evidence.**

---

## 🌟 Executive Overview

LaunchWise AI is an autonomous startup intelligence platform designed for founders, retail innovators, and venture analysts. Rather than relying on static checklists or hallucinatory LLM arithmetic, LaunchWise combines a **multi-stage research pipeline**, a **deterministic Python financial engine**, **geographical competitor discovery**, and an **interactive 22-section feasibility report**.

### Key Questions Answered:
1. **Is this product worth launching?** (Transparent Go / Pilot / Modify / Hold verdict with confidence score)
2. **Is there sufficient customer demand?** (Bottom-up TAM, SAM, SOM sizing with clear catchment population logic)
3. **Who are the direct and indirect competitors?** (Local catchment discovery with verified prices, reviews, and market gaps)
4. **What should the launch price be?** (Budget, standard, and premium tiers based on competitor benchmarks and gross margins)
5. **What are the financial economics?** (Deterministic calculation of break-even units, monthly revenue, 12-month ramp-up projections, and cash runway)
6. **What are the primary fatal risks?** (Severity, likelihood, observed evidence, and practical mitigation strategies)
7. **What is the 30/60/90-day launch roadmap?** (Phased execution plan and low-cost pre-launch validation experiments)

---

## 🏗️ Architecture & Technology Stack

```
                          ┌─────────────────────────┐
                          │   Next.js 15 Frontend   │
                          │ React 19 • Tailwind CSS │
                          │  Recharts • Lucide UI   │
                          └───────────┬─────────────┘
                                      │ /api/:path* rewrites
                                      ▼
                          ┌─────────────────────────┐
                          │   FastAPI Backend API   │
                          │   Python 3.12 • Pydantic│
                          └─────┬──────────────┬────┘
                                │              │
            ┌───────────────────┴──┐        ┌──┴──────────────────┐
            ▼                      ▼        ▼                     ▼
┌───────────────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Financial Engine     │ │ Pipeline     │ │ AI Adapter   │ │ SQLite / PG  │
│  - Deterministic Math │ │ Orchestrator │ │ - Gemini     │ │ - SQLAlchemy │
│  - Unit Economics     │ │ - Stage A-I  │ │ - OpenAI     │ │ - Alembic    │
│  - 12-Mo Projections  │ │ - Search/Map │ │ - Guardrails │ │ - Provenance │
└───────────────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts for interactive charts, Lucide icons, responsive SaaS layout (dark navy sidebar + neutral light workspace).
- **Backend**: Python 3.12, FastAPI, Pydantic v2 schemas, SQLAlchemy ORM.
- **Financial Feasibility Engine**: 100% deterministic Python calculation engine (zero LLM arithmetic errors). Computes contribution margin, break-even sales volume, operating profit, net profit after tax, margin of safety, and Conservative vs Base vs Optimistic scenarios.
- **Reporting & Export**: ReportLab-powered multi-page PDF generation and CSV exports for financial projections and competitor matrices.
- **Database**: SQLite default (zero-configuration local run) or production PostgreSQL via `DATABASE_URL`.
- **Integrations**: Gemini / OpenAI adapter, Tavily research search, Google Places / OpenStreetMap geocoding with robust fallback domain intelligence for demo mode.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend initializes the database and automatically seeds rich, verified demo cases (`demo-bangalore_cafe` and `demo-mumbai_kombucha`).
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- -p 3000
```
Open `http://localhost:3000` in your browser. Next.js automatically proxies all `/api/*` requests to port 8000.

### 4. Running with Docker Compose
```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

---

## 🧪 Automated Test Suite

Run the full pytest suite for financial formulas and API endpoints:
```bash
cd backend
python -m pytest app/tests -v
```
**Test Coverage:**
- `test_unit_economics_standard`: Verifies selling price, unit cost, and gross margin status.
- `test_unit_economics_zero_or_negative_margin`: Validates edge cases and unviable pricing rejection.
- `test_break_even_attainable`: Tests ceiling division and margin of safety formula.
- `test_break_even_unattainable_when_target_too_low`: Confirms warning flags when sales capacity is insufficient.
- `test_break_even_negative_contribution`: Prevents division-by-zero on negative gross margin.
- `test_12_month_projections_and_scenarios`: Tests commercial ramp-up rates and scenario variances.
- `test_health_endpoint`: Checks system health, version, and provider status.
- `test_list_samples_endpoint`: Tests pre-loaded business case loaders.
- `test_financial_simulate_endpoint`: Tests real-time simulation calculations.
- `test_project_crud_and_exports`: Tests project creation, report retrieval, PDF export, and CSV export.

---

## 📊 22-Section Feasibility Report Structure

1. Executive summary
2. Product idea overview
3. Final feasibility recommendation (Verdict badge, viability score, confidence score, transparent rationale)
4. Market demand and industry trends
5. Target market and market sizing (Bottom-up TAM, SAM, SOM)
6. Local market analysis (Pedestrian footfall, demographic density)
7. Direct and indirect competitor comparison
8. Customer personas and pain points
9. Product differentiation and market gaps
10. Pricing and positioning strategy (Budget, standard, premium tiers)
11. Startup budget (CapEx, fit-out, working capital)
12. Financial forecasts and profitability
13. Break-even analysis
14. Conservative, base, and optimistic scenarios
15. Marketing and customer acquisition strategy
16. Operational requirements
17. Regulatory and compliance considerations
18. Risk assessment and mitigation matrix
19. 30/60/90-day execution roadmap
20. Validation experiments (Inexpensive pre-launch tests)
21. Assumptions and limitations
22. Research sources and citations

---

## 🔒 Security & Secrets Management

- **No Hardcoded Keys**: All keys are loaded strictly from `.env`.
- **Untrusted Input Isolation**: Retrieved web search snippets and external places data are encapsulated within XML tags in prompts to prevent prompt injection.
- **Fail-Safe Operation**: When external keys are omitted, LaunchWise AI smoothly operates in Demo Mode using verified, domain-grounded benchmark data without fabricating numbers or hallucinating citations.

---

## 📄 License
MIT License. Created for the LaunchWise AI project.
