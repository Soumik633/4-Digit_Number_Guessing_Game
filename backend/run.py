import uvicorn
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.config import HOST, PORT

if __name__ == "__main__":
    is_prod = os.getenv("ENVIRONMENT", "").lower() in ("production", "prod") or (
        os.getenv("RAILWAY_ENVIRONMENT") is not None
    )
    default_reload = "false" if is_prod else "true"
    reload_enabled = os.getenv("RELOAD", default_reload).lower() in ("true", "1", "yes")

    print(f"Starting Number Hunt Backend on http://{HOST}:{PORT} (reload={reload_enabled})")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=reload_enabled)
