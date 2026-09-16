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
    
    # Qwen / AI
    QEN_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
