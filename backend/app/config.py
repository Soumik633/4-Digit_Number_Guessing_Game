import os

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
# Default origins for local development and direct access
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:3000",
]

# Allow custom frontend URL(s) from environment variable (e.g. Netlify deployment URL)
frontend_url_env = os.getenv("FRONTEND_URL", "").strip()
if frontend_url_env:
    for url in frontend_url_env.split(","):
        cleaned = url.strip().rstrip("/")
        if cleaned and cleaned not in CORS_ORIGINS:
            CORS_ORIGINS.append(cleaned)
else:
    # If FRONTEND_URL is not explicitly specified, permit wildcard for initial deployment flexibility
    if "*" not in CORS_ORIGINS:
        CORS_ORIGINS.append("*")

APP_NAME = "Number Hunt"
SECRET_CODE_LENGTH = 4
