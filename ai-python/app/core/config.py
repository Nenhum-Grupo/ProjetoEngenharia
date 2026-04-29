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

    google_api_key: str = Field(
        default=None,
        description="Chave da API de InteligÃªncia Artificial",
    )
    aws_access_key_id: str = Field(
        default=None,
        description="AWS/OBS Access Key",
    )

    aws_secret_access_key: str = Field(
        default=None,
        description="AWS/OBS Secret Key",
    )

    aws_default_region: str = Field(
        default=None,
        description="AWS/OBS Region",
    )

settings = Settings()
