"""Custom exceptions and exception handlers."""

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Any, Dict


class AppException(Exception):
    """Base application exception."""

    def __init__(self, message: str, status_code: int = 500, details: Dict[str, Any] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class NotFoundException(AppException):
    """Resource not found."""

    def __init__(self, resource: str = "Resource"):
        super().__init__(
            message=f"{resource} not found",
            status_code=404,
            details={"resource": resource},
        )


class ValidationException(AppException):
    """Validation error."""

    def __init__(self, message: str, details: Dict[str, Any] = None):
        super().__init__(
            message=message,
            status_code=422,
            details=details,
        )


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle AppException."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "details": exc.details,
            }
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle HTTPException."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": str(exc.detail) if exc.detail else "HTTP Error",
            }
        },
    )


async def validation_exception_handler(request: Request, exc) -> JSONResponse:
    """Handle validation errors from Pydantic."""
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "message": "Validation error",
                "details": exc.errors() if hasattr(exc, "errors") else str(exc),
            }
        },
    )


def setup_exception_handlers(app) -> None:
    """Setup exception handlers for the FastAPI app."""
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(ValidationException, validation_exception_handler)
