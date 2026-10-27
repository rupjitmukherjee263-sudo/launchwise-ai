from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/health", tags=["System Health"])

@router.get("")
def get_system_health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "is_demo_mode": settings.is_demo_mode,
        "llm_provider": "gemini" if settings.GEMINI_API_KEY else ("openai" if settings.OPENAI_API_KEY else "demo_mock"),
        "search_configured": settings.has_search_key,
        "maps_configured": bool(settings.MAPS_API_KEY)
    }
