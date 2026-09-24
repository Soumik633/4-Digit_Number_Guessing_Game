"""
ASGI Entry Point for Number Hunt Backend.
Supports running via:
  uvicorn main:app --host 0.0.0.0 --port $PORT
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
"""
from app.main import app, fastapi_app

__all__ = ["app", "fastapi_app"]
