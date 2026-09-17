from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "TALVERA Workforce Intelligence"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "talvera-secret-key-change-in-production"
    
    # Database
    DATABASE_URL: str = "sqlite:///./talvera.db"
    
    # Neo4j
    NEO4J_URI: Optional[str] = "bolt://localhost:7687"
    NEO4J_USER: Optional[str] = "neo4j"
    NEO4J_PASSWORD: Optional[str] = "password"
    
    # Qwen 3.8 Flash API Key (OpenRouter)
    QWEN_API_KEY: Optional[str] = "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"
    QWEN_MODEL: str = "qwen/qwen-2.5-72b-instruct" # or qwen 3.8 flash endpoint on OpenRouter
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
