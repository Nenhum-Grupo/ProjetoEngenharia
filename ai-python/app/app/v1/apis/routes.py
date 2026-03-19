"""API routes."""

from fastapi import APIRouter
from typing import Any, Dict

router = APIRouter()


@router.get("/healthz", tags=["Health"])
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


@router.get("/", tags=["Root"])
async def root() -> Dict[str, Any]:
    """Root endpoint."""
    return {
        "app": "app",
        "version": "0.1.0",
        "docs": "/docs",
    }
