# 🎯 Number Hunt — 4-Digit Number Guessing Game

> **Two Players, One Brain Game: Think • Guess • Find • Win!**  
> A real-time online multiplayer and solo Bulls & Cows (Mastermind) web game built with **FastAPI**, **python-socketio**, **React**, and **Vite**.

---

## 🎮 Game Overview

Each player secretly selects a 4-digit code composed of **non-repeating digits** (0–9). Players take strictly alternating turns guessing each other's code. After every guess, two clues are revealed:
- **Digits Matched**: How many digits in your guess exist anywhere in the opponent's number.
- **Positions Matched**: How many of those digits are in the exact right position.

The first player to reach **Positions Matched = 4** cracks the code and wins!

### ✨ Key Features
- 🌐 **Real-Time Multiplayer**: Instant room creation, shareable invite links (`/join/<ROOM_ID>`), and server-enforced private dashboards (the opponent's secret code is never transmitted until game over).
- 🤖 **Solo Mode vs Intelligent AI**:
  - **Easy**: Random non-repeating guesses.
  - **Medium**: Eliminates impossible numbers based on past clues, guessing uniformly from consistent candidates.
  - **Hard**: Donald Knuth-style Minimax information entropy solver (solves within 5 guesses).
- 👥 **Dual Side-by-Side View**: Local pass-and-play and presentation mode matching the infographic design.
- 🎨 **Modern Cyber Aesthetic**: Deep navy theme (`#0B0C1A`), neon green (`#39FF88`), amber (`#FFD23F`), rose (`#FF4F6E`), Google Fonts (*Orbitron*, *JetBrains Mono*, *Inter*), card flip animations, Web Audio API sound effects, and confetti celebrations.
- 🐳 **Docker & Production Ready**: Dockerfiles, Docker Compose, automated health checks, flexible CORS configuration, and native deployment configs for **Railway**, **Render**, **Heroku**, and **Netlify**.

---

## 🚀 Quick Start

Choose your preferred way to run the game locally:

### Option A: One-Click Windows Launcher (Fastest)

If you are on Windows, simply double-click **`start.bat`** from the root folder.  
It automatically starts both the FastAPI backend and Vite frontend dev servers in separate windows.

```cmd
start.bat
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Option B: Manual Local Setup

#### 1. Backend (FastAPI + Socket.IO)

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
# On Windows: venv\Scripts\activate
# On Unix/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy environment template
copy .env.example .env      # On Windows
# cp .env.example .env      # On Unix/macOS

# Run development server
python run.py
```
The backend server runs on **http://localhost:8000**.

#### 2. Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# (Optional) Copy environment template
copy .env.example .env      # On Windows
# cp .env.example .env      # On Unix/macOS

# Start dev server
npm run dev
```
The frontend dev server launches on **http://localhost:5173**.

---

### Option C: Docker & Docker Compose

Run the entire application (both backend and frontend) inside isolated Docker containers:

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up -d
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

To stop the containers:
```bash
docker compose down
```

---

## ⚙️ Environment Variables

Both `backend` and `frontend` contain pre-configured `.env.example` templates.

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `HOST` | `0.0.0.0` | Host address to bind the server |
| `PORT` | `8000` | Port number (automatically assigned by Railway / Heroku in cloud) |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed frontend origin(s) for CORS. Can be a single origin or comma-separated list (e.g. `https://your-site.netlify.app,http://localhost:5173`). Falls back to permissive mode if unset. |
| `ENVIRONMENT` | `development` | Set to `production` in live deployments to disable auto-reload |
| `RELOAD` | `true` (dev) / `false` (prod) | Explicit toggle for uvicorn hot reloading |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API and Socket.IO base URL for production builds |

---

## ☁️ Deployment Guide

### Deploy Backend (Railway / Render / Heroku / Cloud Run)

#### Railway (Recommended)
1. Fork or push this repository to GitHub.
2. Link your repository in [Railway](https://railway.app/).
3. Railway automatically detects the root [`railway.json`](file:///c:/Users/Asus/Desktop/Number%20Hunt/railway.json) and [`Dockerfile`](file:///c:/Users/Asus/Desktop/Number%20Hunt/Dockerfile) (builds seamlessly whether deployed from repository root `/` or with Root Directory set to `/backend`).
4. In **Networking**: Click **Generate Domain** to get your public backend URL.
5. In **Variables**: Add `FRONTEND_URL` with your Netlify site URL (e.g., `https://your-site.netlify.app`).
6. Health checks are automatically monitored via `/health`.

#### Render / Heroku / Dokku
The repository includes a production **`Procfile`** and root **`main.py`** entry point:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
You can also launch via `uvicorn main:app --host 0.0.0.0 --port $PORT`.

#### Docker Deployment
The backend includes a self-contained **`backend/Dockerfile`**:
```bash
cd backend
docker build -t number-hunt-backend .
docker run -p 8000:8000 -e PORT=8000 number-hunt-backend
```

---

### Deploy Frontend (Netlify / Vercel / Cloudflare Pages)

1. Connect your repository to **Netlify** or **Vercel**.
2. **Zero-Configuration with `netlify.toml`**:  
   Netlify automatically detects the root [`netlify.toml`](file:///c:/Users/Asus/Desktop/Number%20Hunt/netlify.toml) configuration:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **SPA Redirects**: Handled automatically via `/* -> /index.html 200` in both [`netlify.toml`](file:///c:/Users/Asus/Desktop/Number%20Hunt/netlify.toml) and [`frontend/public/_redirects`](file:///c:/Users/Asus/Desktop/Number%20Hunt/frontend/public/_redirects) (ensuring room invite links like `/join/:roomId` work seamlessly on page reload).
3. Add environment variable:
   - `VITE_API_URL`: Your deployed Railway backend URL (e.g., `https://YOUR-RAILWAY-DOMAIN.up.railway.app` without trailing slash).
4. Deploy the site!

---

### Single-Container Fullstack Option

FastAPI is configured to automatically serve the compiled frontend SPA bundle if `frontend/dist` is present, while preserving all `/api`, `/socket.io`, `/health`, and `/docs` routes.
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Run backend (now serves static assets + API + WebSockets)
cd ../backend
python run.py
```

---

## 📡 API & WebSocket Reference

### Health Endpoints
- `GET /health`: Standard lightweight health probe for cloud monitoring (Railway / Render / k8s).
- `GET /api/health`: Application status indicator returning `{"status": "ok", "app": "Number Hunt"}`.

### REST Endpoints
- `POST /api/rooms`: Create a new game room (`mode`, `ai_difficulty`, `player_name`).
- `GET /api/rooms/{room_id}`: Fetch status and metadata for a specific room.
- `POST /api/rooms/{room_id}/join`: Join an existing room with a player name.
- `GET /docs`: Interactive Swagger UI documentation.
- `GET /redoc`: ReDoc interactive documentation.

### Socket.IO Real-Time Events
- **Client to Server**:
  - `join_room` (`room_id`, `player_id`, `player_name`): Connect to a room.
  - `set_secret` (`room_id`, `secret_code`): Lock in a 4-unique-digit secret code.
  - `make_guess` (`room_id`, `guess_code`): Submit a turn guess.
  - `play_again` (`room_id`): Reset the room for a rematch.
- **Server to Client**:
  - `sync_state`: Real-time state synchronization tailored to each player's private view.
  - `player_joined`: Broadcasts when opponent enters.
  - `game_started`: Signals that both players set their secrets and guessing begins.
  - `guess_result`: Delivers feedback (`digits_matched`, `positions_matched`).
  - `game_over`: Announces the winner and reveals opponent secrets.
  - `error`: Friendly validation or flow error messages.

---

## 🧪 Running Tests

Run the full suite of backend unit tests (code validator, feedback mathematics, and AI algorithms):

```bash
cd backend
python -m unittest discover tests
```

To verify the frontend build:
```bash
cd frontend
npm run build
```

---

## 📦 Project Structure

```
Number Hunt/
├── backend/
│   ├── .env.example               # Backend environment variables template
│   ├── Dockerfile                 # Production backend container definition
│   ├── Procfile                   # Process file for Heroku / Render deployment
│   ├── railway.json               # Railway Nixpacks deployment config
│   ├── main.py                    # ASGI root entry point (uvicorn main:app)
│   ├── run.py                     # Local & production launcher script
│   ├── requirements.txt           # Python dependencies (FastAPI, uvicorn[standard], socketio)
│   ├── app/
│   │   ├── config.py              # Server configuration & dynamic CORS handling
│   │   ├── main.py                # FastAPI app, health checks, & SPA fallback mount
│   │   ├── game_logic/
│   │   │   ├── validator.py       # 4-unique-digit validation (5,040 permutations)
│   │   │   ├── feedback.py        # Digits & Positions Matched calculation
│   │   │   └── ai_player.py       # Easy / Medium / Hard (Minimax) AI opponents
│   │   ├── models/
│   │   │   ├── game.py            # GameSession & Player dataclasses
│   │   │   └── schemas.py         # Pydantic request/response validation schemas
│   │   ├── routes/
│   │   │   └── rooms.py           # REST endpoints for room creation & joining
│   │   ├── sockets/
│   │   │   └── events.py          # Real-time WebSocket event handlers
│   │   └── store/
│   │       └── session_store.py   # In-memory room session registry
│   └── tests/
│       ├── test_validator.py      # Code validation unit tests
│       ├── test_feedback.py       # Feedback scoring unit tests
│       └── test_ai.py             # AI algorithm unit tests
│
├── frontend/
│   ├── .env.example               # Frontend environment variables template
│   ├── Dockerfile                 # Multi-stage Nginx container definition
│   ├── index.html                 # HTML entry point with Orbitron & Inter fonts
│   ├── package.json               # Node.js dependencies & scripts
│   ├── vite.config.js             # Vite config with dev API / WebSocket proxy
│   ├── public/
│   │   ├── _redirects             # Netlify SPA client-side route redirects
│   │   └── favicon.svg            # Static assets & icons
│   └── src/
│       ├── components/
│       │   ├── Dashboard.jsx      # Private player dashboard layout
│       │   ├── PlayerColumn.jsx   # Guess history table with clue chips
│       │   ├── OpponentColumn.jsx # Opponent guess tracking table
│       │   ├── GuessInput.jsx     # 4-digit input with real-time duplicate validation
│       │   ├── SecretEntry.jsx    # Secret code picker with quick randomize
│       │   ├── TurnBanner.jsx     # Active turn indicator and status messages
│       │   └── WinModal.jsx       # Victory / defeat modal with confetti & rematch
│       ├── hooks/
│       │   └── useGameSocket.js   # Real-time Socket.IO hook with automatic state sync
│       ├── pages/
│       │   ├── Home.jsx           # Landing page with mode selection & rules
│       │   ├── GameRoom.jsx       # Real-time online multiplayer room
│       │   ├── SinglePlayer.jsx   # Solo vs AI match room
│       │   └── DualView.jsx       # Side-by-side local pass-and-play demo view
│       ├── styles/
│       │   ├── theme.css          # Cyber navy CSS tokens & components
│       │   └── animations.css     # Flip cards, glowing pulses, and entrance effects
│       ├── utils/
│       │   └── audio.js           # Web Audio API procedural sound synthesizer
│       ├── api.js                 # REST client for rooms API
│       ├── App.jsx                # Application root with client-side routing
│       └── main.jsx               # React DOM entry point
│
├── .dockerignore                  # Docker build context exclusions
├── Dockerfile                     # Root container build definition for Railway
├── docker-compose.yml             # Multi-service local Docker Compose orchestration
├── netlify.toml                   # Netlify configuration (base, build, SPA redirects)
├── Procfile                       # Root process file for Heroku / Render / Railway
├── railway.json                   # Root Railway Dockerfile deployment config
├── start.bat                      # One-click Windows starter script
├── .gitignore                     # Git ignore rules (virtualenvs, node_modules, .env)
├── LICENSE                        # MIT License
└── README.md                      # Comprehensive project documentation
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
