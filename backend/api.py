# GET /worlds - hämta alla
# GET /worlds/{id} - hämta en
# POST /worlds - skapa
# PATCH /worlds/{id} - uppdatera
# DELETE /worlds/{id} - ta bort

# get_world()
# get_all_worlds()
# create_world()
# update_world()
# delete_world()

from db_setup import get_connection
from fastapi import FastAPI, HTTPException, status, Depends, Cookie, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import bcrypt
import consistency
import schemas
import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    connection = get_connection()
    try:
        yield connection
    finally:
        connection.close()


# Dependency function, to protect endpoints 
# Verifies that there is a valid session connected to the request
def get_current_user(session_id: Optional[str] = Cookie(None), connection=Depends(get_db)):
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    session = db.get_session(connection, session_id)
    if not session:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED)
    return session["user_id"]


@app.post("/register", status_code=status.HTTP_201_CREATED, response_model=schemas.UserResponse)
def create_user(user: schemas.CreateUser, connection=Depends(get_db)):
    try:
        new_user = db.create_user(
            connection,
            user.username,
            user.first_name,
            user.last_name,
            user.email,
            user.password,
        )
        return new_user
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong:{error}")


@app.get("/users/me", response_model=schemas.UserResponse)
def get_current_user_profile(connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        user = db.get_user_by_id(connection, current_user)
        # Returns dictionary with all user data
        return user
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong {error}")


# @app.get("/users/email")
# def get_user_by_email(user_id: int, connection=Depends(get_db)):
#     try:
#         user_by_email = db.get_user_by_email(connection, user_id)
#         # Returns dictionary with all user data
#         return user_by_email
#     except Exception as error:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=f"Something went wrong {error}")


@app.patch("/users/me", response_model=schemas.UserResponse)
def update_user(user: schemas.UserUpdate, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_user = db.update_user(
            connection,
            current_user,
            user.username,
            user.first_name,
            user.last_name,
            user.email
        )
        return updated_user
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong {error}")


@app.delete("/users/me", response_model=schemas.UserResponse)
def delete_user(connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_user = db.delete_user(connection, current_user)
        # Returns dictionary with deleted user's data, returns None if user doesn't exist
        return deleted_user
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong {error}")


@app.post("/login")
def login(data: schemas.UserLogin, response: Response, connection=Depends(get_db)):
    user = db.get_user_by_email(connection, data.email)

    if not user or not bcrypt.checkpw(data.password.encode(), user["password"].encode()):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
        )
    
    session_id = db.create_session(connection, user["user_id"])
    response.set_cookie(key="session_id", value=session_id, httponly=True, samesite="lax")
    return {"message": "Login successful", "user_id": user["user_id"], "username": user["username"]}


# Log out
@app.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, session_id: Optional[str] = Cookie(None), connection=Depends(get_db),):
    if session_id:
        db.delete_session(connection, session_id)
        response.delete_cookie("session_id")


# Worlds
@app.post("/worlds", status_code=status.HTTP_201_CREATED)
def create_world(world: schemas.CreateWorld, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        new_world = db.create_world(
            connection,
            current_user,
            world.world_name,
            world.world_description,
            world.image_url,
        )
        return new_world
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/worlds")
def get_all_worlds(connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        all_worlds = db.get_all_worlds(connection, current_user)
        return all_worlds
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/worlds/{world_id}")
def get_world_by_id(world_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        world = db.get_world_by_id(connection, world_id)
        if not world:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="World not found"
            )
        return world
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.patch("/worlds/{world_id}")
def update_world(world_id: int, world: schemas.UpdateWorld, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_world = db.update_world(
            connection,
            world_id,
            world.world_name,
            world.world_description,
            world.image_url,
        )
        if not updated_world:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="World not found"
            )
        return updated_world
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/worlds/{world_id}")
def delete_world(world_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_world = db.delete_world(connection, world_id)
        if not deleted_world:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="World not found"
            )
        return {"message": "World deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# World_rules
@app.post("/worlds/{world_id}/world_rules", status_code=status.HTTP_201_CREATED)
def create_rule(world_id: int, rule: schemas.CreateRule, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        new_rule = db.create_rule(
            connection,
            world_id,
            current_user,
            rule.rule_text,
        )
        return new_rule
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/worlds/{world_id}/world_rules")
def get_all_rules(world_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        all_rules = db.get_all_rules(connection, world_id)
        return all_rules
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.patch("/world_rules/{rule_id}")
def update_rule(rule_id: int, rule: schemas.UpdateRule, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_rule = db.update_rule(
            connection,
            rule_id,
            rule.rule_text,
        )
        if not updated_rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="rule not found"
            )
        return updated_rule
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/world_rules/{rule_id}")
def delete_rule(rule_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_rule = db.delete_rule(connection, rule_id)
        if not deleted_rule:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="World rule not found"
            )
        return {"message": "World rule deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# Characters
@app.post("/worlds/{world_id}/characters", status_code=status.HTTP_201_CREATED)
def create_character(world_id: int, character: schemas.CreateCharacter, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        new_character = db.create_character(
            connection,
            world_id,
            character.character_name,
            character.character_description,
            character.birth_year,
            character.is_alive,
            character.image_url,
            character.image_id,
            character.species_id,
            character.item_id,
        )
        return new_character
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/worlds/{world_id}/characters")
def get_all_characters(world_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        all_characters = db.get_all_characters(connection, world_id)
        return all_characters
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/characters/{character_id}")
def get_character_by_id(character_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        character = db.get_character_by_id(connection, character_id)
        if not character:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Character not found"
            )
        return character
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.patch("/characters/{character_id}")
def update_character(character_id: int, character: schemas.UpdateCharacter, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_character = db.update_character(
            connection,
            character_id,
            character.character_name,
            character.character_description,
            character.birth_year,
            character.is_alive,
            character.image_url,
            character.image_id,
            character.species_id,
            character.item_id,
        )
        if not updated_character:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Character not found"
            )
        return updated_character
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/characters/{character_id}")
def delete_character(character_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_character = db.delete_character(connection, character_id)
        if not deleted_character:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Character not found"
            )
        return {"message": "Character deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# Relationships
@app.post("/characters/{character_id}/relationships", status_code=status.HTTP_201_CREATED)
def create_relationship(character_id: int, relationship: schemas.CreateRelationship, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        new_relationship = db.create_relationship(
            connection,
            relationship.relationship_type,
            relationship.character_a_id,
            relationship.character_b_id,
        )
        return new_relationship
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/characters/{character_id}/relationships")
def get_relationships_for_character(character_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        relationships = db.get_relationships_for_character(connection, character_id)
        return relationships
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.patch("/relationships/{relationship_id}")
def update_relationship(relationship_id: int, relationship: schemas.UpdateRelationship, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_relationship = db.update_relationship(
            connection,
            relationship_id,
            relationship.relationship_type,
            relationship.character_a_id,
            relationship.character_b_id,
        )
        if not updated_relationship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Relationship not found"
            )
        return updated_relationship
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/relationships/{relationship_id}")
def delete_relationship(relationship_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_relationship = db.delete_relationship(connection, relationship_id)
        if not deleted_relationship:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Relationship not found"
            )
        return {"message": "Relationship deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# Events
@app.post("/worlds/{world_id}/events", status_code=status.HTTP_201_CREATED)
def create_event(world_id: int, event: schemas.CreateEvent, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        new_event = db.create_event(
            connection,
            world_id,
            event.event_name,
            event.event_description,
            event.start_year,
            event.end_year,
        )
        return new_event
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/worlds/{world_id}/events")
def get_all_events(world_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        all_events = db.get_all_events(connection, world_id)
        return all_events
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/events/{event_id}")
def get_event_by_id(event_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        event = db.get_event_by_id(connection, event_id)
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )
        return event
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.patch("/events/{event_id}")
def update_event(event_id: int, event: schemas.UpdateEvent, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_event = db.update_event(
            connection,
            event_id,
            event.event_name,
            event.event_description,
            event.start_year,
            event.end_year,
        )
        if not updated_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )
        return updated_event
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/events/{event_id}")
def delete_event(event_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_event = db.delete_event(connection, event_id)
        if not deleted_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
            )
        return {"message": "Event deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# Character_events
@app.post("/events/{event_id}/characters/{character_id}", status_code=status.HTTP_201_CREATED)
def add_character_to_event(event_id: int, character_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        added_to_event = db.add_character_to_event(connection, event_id, character_id)
        return added_to_event
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/events/{event_id}/characters/{character_id}")
def remove_character_from_event(event_id: int, character_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        removed_from_event = db.remove_character_from_event(
            connection, event_id, character_id
        )
        if not removed_from_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Character not found in event",
            )
        return {"message": "Character removed successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/events/{event_id}/characters")
def get_all_characters_for_event(event_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        characters = db.get_all_characters_for_event(connection, event_id)
        return characters
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/characters/{character_id}/events")
def get_all_events_for_one_character(character_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        events = db.get_all_events_for_one_character(connection, character_id)
        return events
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# Maps
@app.post("/worlds/{world_id}/maps", status_code=status.HTTP_201_CREATED)
def create_map(world_id: int, map_input: schemas.CreateMap, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        new_map = db.create_map(
            connection,
            world_id,
            map_input.map_name,
            map_input.map_url,
            map_input.map_description,
            map_input.scale_factor,
        )
        return new_map
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/worlds/{world_id}/maps")
def get_all_maps_for_one_world(world_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        all_maps = db.get_all_maps_for_one_world(connection, world_id)
        return all_maps
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.get("/maps/{map_id}")
def get_map_by_id(map_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        map_by_id = db.get_map_by_id(connection, map_id)
        if not map_by_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Map not found"
            )
        return map_by_id
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.patch("/maps/{map_id}")
def update_map(map_id: int, map_input: schemas.UpdateMap, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        updated_map = db.update_map(
            connection,
            map_id,
            map_input.map_name,
            map_input.map_url,
            map_input.map_description,
            map_input.scale_factor,
        )
        if not updated_map:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Map not found"
            )
        return updated_map
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


@app.delete("/maps/{map_id}")
def delete_map(map_id: int, connection=Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        deleted_map = db.delete_map(connection, map_id)
        if not deleted_map:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Map not found"
            )
        return {"message": "Map deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")


# Locations - skapa plats
@app.post("/locations", status_code=status.HTTP_201_CREATED)
def create_location(
    location: schemas.CreateLocation,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        new_location = db.create_location(
            connection,
            location.location_name,
            location.location_description,
            location.world_id,
            location.map_id,
            location.location_type,
        )
        return new_location
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - hämta alla platser
@app.get("/worlds/{world_id}/locations")
def get_all_locations(
    world_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        all_locations = db.get_all_locations(connection, world_id)
        return all_locations
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - hämta specifik plats med id
@app.get("/locations/{location_id}")
def get_location_by_id(
    location_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        location = db.get_location_by_id(connection, location_id)
        if not location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Location not found"
            )
        return location
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - uppdatera plats
@app.patch("/locations/{location_id}")
def update_location(
    location_id: int,
    location: schemas.LocationUpdate,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        updated_location = db.update_location(
            connection,
            location_id,
            location.location_name,
            location.location_description,
            location.location_type,
            location.map_id,
        )
        if not updated_location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Location not found"
            )
        return updated_location
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - radera en location
@app.delete("/locations/{location_id}")
def delete_location(
    location_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        deleted_location = db.delete_location(connection, location_id)
        if not deleted_location:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Location not found"
            )
        return {"message": "Location deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# -----------ITEMS - SONIA--------


# Items - Skapa föremål
@app.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(
    item: schemas.CreateItem,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        new_item = db.create_item(
            connection, item.item_name, item.item_description, item.world_id
        )
        return new_item
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Hämta alla föremål
@app.get("/worlds/{world_id}/items")
def get_all_items(
    world_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        all_items = db.get_all_items(connection, world_id)
        return all_items
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Hämta specifikt föremål med id
@app.get("/items/{item_id}")
def get_item_by_id(
    item_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        item = db.get_item_by_id(connection, item_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        return item
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Uppdatera föremål
@app.patch("/items/{item_id}")
def update_item(
    item_id: int,
    item: schemas.ItemUpdate,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        updated_item = db.update_item(
            connection, item_id, item.item_name, item.item_description
        )
        if not updated_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        return updated_item
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Radera föremål
@app.delete("/items/{item_id}")
def delete_item(
    item_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        deleted_item = db.delete_item(connection, item_id)
        if not deleted_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        return {"message": "Item deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# ----------- SPECIES - SONIA -------


# Species - Skapa varelse
@app.post("/species", status_code=status.HTTP_201_CREATED)
def create_species(
    species: schemas.CreateSpecies,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        new_species = db.create_species(
            connection,
            species.species_name,
            species.species_description,
            species.world_id,
        )
        return new_species
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Species - Hämta alla varelser
@app.get("/worlds/{world_id}/species")
def get_all_species(
    world_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        all_species = db.get_all_species(connection, world_id)
        return all_species
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Species - Hämta specifikt varelse med id
@app.get("/species/{species_id}")
def get_species_by_id(
    species_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        species = db.get_species_by_id(connection, species_id)
        if not species:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Species not found"
            )
        return species
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Species - Uppdatera varelse
@app.patch("/species/{species_id}")
def update_species(
    species_id: int,
    species: schemas.SpeciesUpdate,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        updated_species = db.update_species(
            connection, species_id, species.species_name, species.species_description
        )
        if not updated_species:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Species not found"
            )
        return updated_species
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Species - Radera varelse
@app.delete("/species/{species_id}")
def delete_species(
    species_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        deleted_species = db.delete_species(connection, species_id)
        if not deleted_species:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Species not found"
            )
        return {"message": "Species deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


#   ------ NOTES - SONIA ---------


# Notes - Skapa anteckning
@app.post("/notes", status_code=status.HTTP_201_CREATED)
def create_note(
    note: schemas.CreateNote,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        # Använd current_user från session istället för note.user_id
        new_note = db.create_note(
            connection, note.note_name, note.note_text, current_user
        )
        return new_note
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Notes - Hämta alla anteckningar
@app.get("/users/{user_id}/notes")
def get_all_notes(
    user_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        # Säkerhet, användare kan bara se sina egna notes
        if user_id != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot access other users' notes",
            )

        all_notes = db.get_all_notes(connection, user_id)
        return all_notes
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Notes - Hämta specifik anteckning med id
@app.get("/notes/{notes_id}")
def get_note_by_id(
    notes_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        note = db.get_note_by_id(connection, notes_id)
        if not note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
            )

        # Säk, användare kan bara se sina egna notes
        if note["user_id"] != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot access other users' notes",
            )

        return note
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Notes - Uppdatera anteckningar
@app.patch("/notes/{notes_id}")
def update_note(
    notes_id: int,
    note: schemas.NoteUpdate,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        # Kollar att note tillhör användaren
        existing_note = db.get_note_by_id(connection, notes_id)
        if not existing_note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
            )

        if existing_note["user_id"] != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot update other users' notes",
            )

        updated_note = db.update_note(
            connection, notes_id, note.note_name, note.note_text
        )
        return updated_note
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Notes - Radera anteckning
@app.delete("/notes/{notes_id}")
def delete_note(
    notes_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        # Kollar att note tillhör användaren
        existing_note = db.get_note_by_id(connection, notes_id)
        if not existing_note:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
            )

        if existing_note["user_id"] != current_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot delete other users' notes",
            )

        deleted_note = db.delete_note(connection, notes_id)
        return {"message": "Note deleted successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# -------- JUNCTION TABLES - SONIA ---------


# ------Wordl-Items junction------
# World-Items junction - Koppla item till en värld
@app.post("/worlds/{world_id}/items/{item_id}", status_code=status.HTTP_201_CREATED)
def add_item_to_world(
    world_id: int,
    item_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO world_items (world_id, item_id)
                VALUES (%s, %s)
                """,
                (world_id, item_id),
            )
            connection.commit()
        return {"message": "Item added to world successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# World-Items junction - Ta bort kopplingen
@app.delete("/worlds/{world_id}/items/{item_id}")
def remove_item_from_world(
    world_id: int,
    item_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM world_items
                WHERE world_id = %s AND item_id = %s
                """,
                (world_id, item_id),
            )
            connection.commit()
        return {"message": "Item removed from world successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# World-Items junction - Hämta alla items för en värld (använder annan route)
@app.get("/worlds/{world_id}/items/all")
def get_world_items(
    world_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        all_items = db.get_items_by_world(connection, world_id)
        return all_items
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# --------World-species Junction----------
# World-Species junction - Koppla species till värld
@app.post(
    "/worlds/{world_id}/species/{species_id}", status_code=status.HTTP_201_CREATED
)
def add_species_to_world(
    world_id: int,
    species_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO world_species (world_id, species_id)
                VALUES (%s, %s)
                """,
                (world_id, species_id),
            )
            connection.commit()
        return {"message": "Species added to world successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# World-Species junction - Ta bort koppling
@app.delete("/worlds/{world_id}/species/{species_id}")
def remove_species_from_world(
    world_id: int,
    species_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM world_species
                WHERE world_id = %s AND species_id = %s
                """,
                (world_id, species_id),
            )
            connection.commit()
        return {"message": "Species removed from world successfully"}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# World-Species junction - Hämta alla species för en värld (använder annan route)
@app.get("/worlds/{world_id}/species/all")
def get_world_species(
    world_id: int,
    connection=Depends(get_db),
    current_user: int = Depends(get_current_user),
):
    try:
        all_species = db.get_species_by_world(connection, world_id)
        return all_species
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


@app.post("/worlds/{world_id}/consistency-check", status_code=status.HTTP_200_OK)
def consistency_check(world_id: int, connection=Depends(get_db)):
    try:
        result = consistency.run_consistency_check(world_id, connection)
        return result
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}")