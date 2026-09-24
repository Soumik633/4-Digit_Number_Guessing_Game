import uvicorn
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from app.config import HOST, PORT

if __name__ == "__main__":
    print(f"Starting Number Hunt Backend on http://localhost:{PORT}")
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
