import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import socketio

from .config import CORS_ORIGINS, APP_NAME
from .routes.rooms import router as rooms_router
from .sockets.events import sio

fastapi_app = FastAPI(
    title=APP_NAME,
    description="Number Hunt 4-Digit Number Guessing Game (Bulls and Cows / Mastermind) API",
    version="1.0.0"
)

# CORS configuration
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API routers
fastapi_app.include_router(rooms_router)

@fastapi_app.get("/api/health")
async def health_check():
    return {"status": "ok", "app": APP_NAME}

# Check if frontend built bundle exists and serve it
frontend_dist_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")
)

if os.path.exists(frontend_dist_dir):
    fastapi_app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_dir, "assets")), name="assets")

    @fastapi_app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API or socket.io routes
        if full_path.startswith("api") or full_path.startswith("socket.io"):
            return None
        file_candidate = os.path.join(frontend_dist_dir, full_path)
        if os.path.isfile(file_candidate):
            return FileResponse(file_candidate)
        return FileResponse(os.path.join(frontend_dist_dir, "index.html"))

# Wrap with Socket.IO ASGI app
app = socketio.ASGIApp(
    socketio_server=sio,
    other_asgi_app=fastapi_app,
    socketio_path="socket.io"
)
