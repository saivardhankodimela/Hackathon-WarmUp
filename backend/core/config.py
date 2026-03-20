from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json

class Settings(BaseSettings):
    # Google API
    GOOGLE_API_KEY: str

    # Firebase
    GOOGLE_APPLICATION_CREDENTIALS: str | None = None
    FIREBASE_PROJECT_ID: str

    # FastAPI
    APP_ENV: str = "development"
    CORS_ORIGINS: str = '["http://localhost:3000"]'

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except json.JSONDecodeError:
            return ["http://localhost:3000"]

settings = Settings()
