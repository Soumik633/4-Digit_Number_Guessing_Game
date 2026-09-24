from fastapi import APIRouter, HTTPException, status
from ..models.schemas import (
    CreateRoomRequest,
    CreateRoomResponse,
    JoinRoomRequest,
    JoinRoomResponse,
    SubmitSecretRequest,
    SubmitGuessRequest,
    RoomInfoResponse
)
from ..store.session_store import session_store
from ..game_logic.validator import validate_code

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])

@router.post("", response_model=CreateRoomResponse)
async def create_room(req: CreateRoomRequest):
    """Creates a new game session (multiplayer or vs AI)."""
    mode = req.mode if req.mode in ["multiplayer", "single_player", "local"] else "multiplayer"
    ai_diff = req.ai_difficulty if req.ai_difficulty in ["easy", "medium", "hard"] else "medium"
    
    session = session_store.create_session(mode=mode, ai_difficulty=ai_diff)
    if req.player_name:
        session.player_a.name = req.player_name
    
    return CreateRoomResponse(
        room_id=session.room_id,
        invite_link=f"/join/{session.room_id}",
        mode=session.mode,
        player_id="A"
    )

@router.get("/{room_id}", response_model=RoomInfoResponse)
async def get_room(room_id: str):
    """Gets metadata for a room."""
    session = session_store.get_session(room_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    return RoomInfoResponse(
        room_id=session.room_id,
        mode=session.mode,
        status=session.status,
        current_turn=session.current_turn,
        winner=session.winner
    )

@router.post("/{room_id}/join", response_model=JoinRoomResponse)
async def join_room(room_id: str, req: JoinRoomRequest):
    """Joins an existing multiplayer room as Player B."""
    session = session_store.get_session(room_id)
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    
    if session.mode != "multiplayer":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Room is not in multiplayer mode")
    
    if session.player_b.is_connected and session.player_b.sid is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Room is already full")

    if req.player_name:
        session.player_b.name = req.player_name
    
    session.status = "setup"

    return JoinRoomResponse(
        room_id=session.room_id,
        player_id="B",
        status=session.status,
        message="Joined room successfully"
    )
