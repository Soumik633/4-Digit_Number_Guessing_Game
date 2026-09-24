# 🎯 Number Hunt — 4-Digit Number Guessing Game

> **Two Players, One Brain Game: Think • Guess • Find • Win!**  
> A real-time online multiplayer and solo Bulls & Cows (Mastermind) web game built with **FastAPI**, **python-socketio**, **React**, and **Vite**.

---

## 🎮 Game Overview

Each player secretly selects a 4-digit code composed of **non-repeating digits** (0–9). Players take strictly alternating turns guessing each other's code. After every guess, two clues are revealed:
- **Digits Matched**: How many digits in your guess exist anywhere in the opponent's number.
- **Positions Matched**: How many of those digits are in the exact right position.

The first player to reach **Positions Matched = 4** cracks the code and wins!

### Key Features
- 🌐 **Real-Time Multiplayer**: Instant room creation, shareable invite links (`/join/<ROOM_ID>`), and server-enforced private dashboards (the opponent's secret is never sent to the client until game over).
- 🤖 **Solo Mode vs Intelligent AI**:
  - **Easy**: Random non-repeating guesses.
  - **Medium**: Eliminates impossible numbers based on past clues, guessing uniformly from consistent candidates.
  - **Hard**: Donald Knuth-style Minimax information entropy solver (solves within 5 guesses).
- 👥 **Dual Side-by-Side View**: Local pass-and-play / presentation mode matching the infographic mockup.
- 🎨 **Modern Cyber Aesthetic**: Deep navy theme (`#0B0C1A`), neon green (`#39FF88`), amber (`#FFD23F`), rose (`#FF4F6E`), Google Fonts (*Orbitron*, *JetBrains Mono*, *Inter*), flip-card animations, Web Audio API sound effects, and celebratory confetti.

---

## 🚀 Quick Start

### 1. Backend (FastAPI + Socket.IO)

```bash
cd backend
python -m pip install -r requirements.txt
python run.py
```
The backend server will start on **http://localhost:8000**.

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will launch on **http://localhost:5173**.

---

## 🧪 Running Tests

To run the full suite of backend unit tests (validator, feedback math, and AI logic):

```bash
cd backend
python -m unittest discover tests
```

---

## 📦 Project Structure

```
Number Hunt/
├── backend/
│   ├── app/
│   │   ├── config.py                  # Server configuration
│   │   ├── main.py                    # FastAPI app + Socket.IO mount
│   │   ├── game_logic/
│   │   │   ├── validator.py           # 4-unique-digit validation (5,040 codes)
│   │   │   ├── feedback.py            # Digits & Positions Matched math
│   │   │   └── ai_player.py           # Easy / Medium / Hard AI opponent
│   │   ├── models/
│   │   │   ├── game.py                # GameSession, Player dataclasses
│   │   │   └── schemas.py             # Pydantic request/response models
│   │   ├── routes/
│   │   │   └── rooms.py               # REST endpoints for room creation & joining
│   │   ├── sockets/
│   │   │   └── events.py              # WebSocket real-time event handlers
│   │   └── store/
│   │       └── session_store.py       # In-memory room session registry
│   ├── tests/
│   │   ├── test_validator.py          # Validation tests
│   │   ├── test_feedback.py           # Clue & scoring tests
│   │   └── test_ai.py                 # AI algorithm tests
│   ├── requirements.txt
│   └── run.py                         # Launcher script
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx          # Private player dashboard
│   │   │   ├── PlayerColumn.jsx       # My guesses table
│   │   │   ├── OpponentColumn.jsx     # Opponent guesses table
│   │   │   ├── GuessInput.jsx         # 4-digit input with duplicate validation
│   │   │   ├── SecretEntry.jsx        # Setup-phase secret selector
│   │   │   ├── TurnBanner.jsx         # Active turn status indicator
│   │   │   └── WinModal.jsx           # Victory fanfare & code reveal
│   │   ├── hooks/
│   │   │   └── useGameSocket.js       # Real-time WebSocket hook
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page with mode selection & rules
│   │   │   ├── GameRoom.jsx           # Multiplayer room view
│   │   │   ├── SinglePlayer.jsx       # Solo vs AI view
│   │   │   └── DualView.jsx           # Side-by-side local demo view
│   │   ├── styles/
│   │   │   ├── theme.css              # Cyber navy design tokens
│   │   │   └── animations.css         # Pulses, card flips, win pops
│   │   ├── utils/
│   │   │   └── audio.js               # Web Audio API synthesizer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── api.js                     # REST client
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── README.md
└── .gitignore
```
