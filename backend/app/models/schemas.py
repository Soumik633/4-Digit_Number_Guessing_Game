from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class CreateRoomRequest(BaseModel):
    mode: str = Field(default="multiplayer", description="Game mode: multiplayer or single_player")
    ai_difficulty: Optional[str] = Field(default="medium", description="easy, medium, or hard")
    player_name: Optional[str] = Field(default="Player A", description="Host name")

class CreateRoomResponse(BaseModel):
    room_id: str
    invite_link: str
    mode: str
    player_id: str

class JoinRoomRequest(BaseModel):
    player_name: Optional[str] = Field(default="Player B", description="Joiner name")

class JoinRoomResponse(BaseModel):
    room_id: str
    player_id: str
    status: str
    message: str

class SubmitSecretRequest(BaseModel):
    secret: str
    player_id: str

class SubmitGuessRequest(BaseModel):
    guess: str
    player_id: str

class RoomInfoResponse(BaseModel):
    room_id: str
    mode: str
    status: str
    current_turn: str
    winner: Optional[str] = None
