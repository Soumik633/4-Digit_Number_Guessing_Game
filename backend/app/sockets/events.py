import asyncio
import socketio
from typing import Dict, Any, Optional
from ..config import CORS_ORIGINS
from ..store.session_store import session_store
from ..game_logic.validator import validate_code
from ..game_logic.feedback import calculate_feedback

# Create Async Socket.IO Server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*" if "*" in CORS_ORIGINS else CORS_ORIGINS
)

# Sid mapping to (room_id, player_id)
sid_to_player: Dict[str, Dict[str, str]] = {}


async def send_private_sync(room_id: str):
    """Sends each player in the room their own strictly private view of the game state."""
    session = session_store.get_session(room_id)
    if not session:
        return

    # Sync Player A if connected
    if session.player_a.sid:
        await sio.emit("sync_state", session.to_dict_for_player("A"), to=session.player_a.sid)
    
    # Sync Player B if connected and human
    if session.player_b.sid and session.mode != "single_player":
        await sio.emit("sync_state", session.to_dict_for_player("B"), to=session.player_b.sid)


@sio.event
async def connect(sid, environ, auth=None):
    pass


@sio.event
async def disconnect(sid):
    if sid in sid_to_player:
        info = sid_to_player.pop(sid)
        room_id = info["room_id"]
        player_id = info["player_id"]
        session = session_store.get_session(room_id)
        if session:
            player = session.get_player(player_id)
            if player:
                player.is_connected = False
                player.sid = None
            await sio.emit("opponent_left", {"player_id": player_id}, room=room_id, skip_sid=sid)
            await send_private_sync(room_id)


@sio.event
async def join_room(sid, data: Dict[str, Any]):
    room_id = data.get("room_id", "").upper().strip()
    player_id = data.get("player_id", "A")
    player_name = data.get("player_name")

    session = session_store.get_session(room_id)
    if not session:
        await sio.emit("error_message", {"message": f"Room {room_id} not found."}, to=sid)
        return

    player = session.get_player(player_id)
    if not player:
        await sio.emit("error_message", {"message": f"Invalid player {player_id}."}, to=sid)
        return

    if player_name and str(player_name).strip():
        player.name = str(player_name).strip()

    player.sid = sid
    player.is_connected = True
    sid_to_player[sid] = {"room_id": room_id, "player_id": player_id}
    await sio.enter_room(sid, room_id)

    # If Player B joined multiplayer room, notify Player A
    if player_id == "B" and session.mode == "multiplayer":
        session.status = "setup"
        await sio.emit("player_joined", {"player_id": "B", "name": player.name}, room=room_id)

    await send_private_sync(room_id)


@sio.event
async def submit_secret(sid, data: Dict[str, Any]):
    room_id = data.get("room_id", "").upper().strip()
    player_id = data.get("player_id")
    secret = str(data.get("secret", "")).strip()

    session = session_store.get_session(room_id)
    if not session:
        await sio.emit("error_message", {"message": "Session not found."}, to=sid)
        return

    valid, err_msg = validate_code(secret)
    if not valid:
        await sio.emit("validation_error", {"field": "secret", "message": err_msg}, to=sid)
        return

    player = session.get_player(player_id)
    if not player:
        await sio.emit("error_message", {"message": "Player not found."}, to=sid)
        return

    player.secret = secret
    player.is_ready = True

    # Check if both players are ready
    if session.player_a.is_ready and session.player_b.is_ready:
        session.status = "playing"
        session.current_turn = "A"
        await sio.emit("game_started", {
            "current_turn": session.current_turn,
            "message": "Both players locked in their codes! Game on!"
        }, room=room_id)
    else:
        # Notify opponent that player locked in their code
        await sio.emit("opponent_ready", {"player_id": player_id}, room=room_id, skip_sid=sid)

    await send_private_sync(room_id)


@sio.event
async def submit_guess(sid, data: Dict[str, Any]):
    room_id = data.get("room_id", "").upper().strip()
    player_id = data.get("player_id")
    guess = str(data.get("guess", "")).strip()

    session = session_store.get_session(room_id)
    if not session:
        await sio.emit("error_message", {"message": "Session not found."}, to=sid)
        return

    if session.status != "playing":
        await sio.emit("turn_error", {"message": "Game is not currently active."}, to=sid)
        return

    if session.current_turn != player_id:
        await sio.emit("turn_error", {"message": "It is not your turn! Please wait for opponent."}, to=sid)
        return

    valid, err_msg = validate_code(guess)
    if not valid:
        await sio.emit("validation_error", {"field": "guess", "message": err_msg}, to=sid)
        return

    player = session.get_player(player_id)
    opponent = session.get_opponent(player_id)
    if not player or not opponent or not opponent.secret:
        await sio.emit("error_message", {"message": "Opponent secret is not ready."}, to=sid)
        return

    # Calculate feedback against defender's secret
    feedback = calculate_feedback(guess, opponent.secret)
    from ..models.game import GuessRecord
    guess_record = GuessRecord(
        index=len(player.guesses) + 1,
        guess=guess,
        digits_matched=feedback["digits_matched"],
        positions_matched=feedback["positions_matched"],
        status=feedback["status"]
    )
    player.guesses.append(guess_record)

    # Check for win
    if feedback["is_win"]:
        session.status = "game_over"
        session.winner = player_id
        await sio.emit("guess_result", {
            "player_id": player_id,
            "guess_record": guess_record.to_dict(),
            "next_turn": None
        }, room=room_id)
        await sio.emit("game_over", {
            "winner": player_id,
            "winner_name": player.name,
            "player_a_name": session.player_a.name,
            "player_b_name": session.player_b.name,
            "player_a_secret": session.player_a.secret,
            "player_b_secret": session.player_b.secret,
            "total_guesses": len(player.guesses)
        }, room=room_id)
        await send_private_sync(room_id)
        return

    # Switch turn
    session.switch_turn()
    await sio.emit("guess_result", {
        "player_id": player_id,
        "guess_record": guess_record.to_dict(),
        "next_turn": session.current_turn
    }, room=room_id)
    await send_private_sync(room_id)

    # Handle AI turn if single player vs computer
    if session.mode == "single_player" and session.current_turn == "B" and session.status == "playing":
        asyncio.create_task(run_ai_turn(room_id))


async def run_ai_turn(room_id: str):
    """Executes the AI turn with realistic thinking delay."""
    await asyncio.sleep(0.9)  # Brief natural delay for game feel
    session = session_store.get_session(room_id)
    ai = session_store.get_ai(room_id)

    if not session or not ai or session.status != "playing" or session.current_turn != "B":
        return

    ai_guess = ai.make_guess()
    player_a = session.player_a
    if not player_a.secret:
        return

    feedback = calculate_feedback(ai_guess, player_a.secret)
    ai.record_feedback(ai_guess, feedback["digits_matched"], feedback["positions_matched"])

    from ..models.game import GuessRecord
    guess_record = GuessRecord(
        index=len(session.player_b.guesses) + 1,
        guess=ai_guess,
        digits_matched=feedback["digits_matched"],
        positions_matched=feedback["positions_matched"],
        status=feedback["status"]
    )
    session.player_b.guesses.append(guess_record)

    if feedback["is_win"]:
        session.status = "game_over"
        session.winner = "B"
        await sio.emit("guess_result", {
            "player_id": "B",
            "guess_record": guess_record.to_dict(),
            "next_turn": None
        }, room=room_id)
        await sio.emit("game_over", {
            "winner": "B",
            "winner_name": session.player_b.name,
            "player_a_name": session.player_a.name,
            "player_b_name": session.player_b.name,
            "player_a_secret": session.player_a.secret,
            "player_b_secret": session.player_b.secret,
            "total_guesses": len(session.player_b.guesses)
        }, room=room_id)
    else:
        session.switch_turn()
        await sio.emit("guess_result", {
            "player_id": "B",
            "guess_record": guess_record.to_dict(),
            "next_turn": session.current_turn
        }, room=room_id)

    await send_private_sync(room_id)


@sio.event
async def restart_game(sid, data: Dict[str, Any]):
    room_id = data.get("room_id", "").upper().strip()
    session = session_store.get_session(room_id)
    if not session:
        return

    session.player_a.guesses.clear()
    session.player_b.guesses.clear()
    session.player_a.secret = None
    session.player_b.secret = None
    session.player_a.is_ready = False
    session.player_b.is_ready = False
    session.winner = None
    session.current_turn = "A"
    session.status = "setup"

    if session.mode == "single_player":
        from ..game_logic.ai_player import AIPlayer
        ai = AIPlayer(difficulty=session.ai_difficulty)
        session_store.set_ai(room_id, ai)
        session.player_b.secret = ai.secret
        session.player_b.is_ready = True

    await sio.emit("game_restarted", {"status": "setup"}, room=room_id)
    await send_private_sync(room_id)
