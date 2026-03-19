"""Application configuration."""

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = Field(default="app", description="Application name")
    debug: bool = Field(default=False, description="Debug mode")
    api_v1_str: str = Field(default="/api/v1", description="API version 1 prefix")
    database_url: str = Field(default="", description="Database connection URL")


settings = Settings()
