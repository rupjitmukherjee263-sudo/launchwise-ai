import os
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LaunchWise AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = "sqlite:///./launchwise.db"
    
    # External API Keys (Optional - Demo mode activated automatically if missing)
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None
    MAPS_API_KEY: Optional[str] = None
    
    # Mode overrides
    FORCE_LIVE_RESEARCH: bool = False
    
    # Security & CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    
    @property
    def has_llm_key(self) -> bool:
        return bool(self.GEMINI_API_KEY or self.OPENAI_API_KEY)
        
    @property
    def has_search_key(self) -> bool:
        return bool(self.TAVILY_API_KEY)

    @property
    def is_demo_mode(self) -> bool:
        if self.FORCE_LIVE_RESEARCH:
            return False
        return not (self.has_llm_key and self.has_search_key)

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
