from app.routers.health import router as health_router
from app.routers.projects import router as projects_router
from app.routers.analysis import router as analysis_router
from app.routers.financial import router as financial_router
from app.routers.competitors import router as competitors_router
from app.routers.reports import router as reports_router
from app.routers.chat import router as chat_router

__all__ = [
    "health_router",
    "projects_router",
    "analysis_router",
    "financial_router",
    "competitors_router",
    "reports_router",
    "chat_router"
]
