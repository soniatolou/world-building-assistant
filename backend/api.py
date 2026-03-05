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
from fastapi import FastAPI, HTTPException, status
from fastapi import Depends
import schemas
import db

app = FastAPI()


def get_db():
    connection = get_connection()
    try:
        yield connection
    finally:
        connection.close()


# Users - create account
@app.post("/users", status.HTTP_201_CREATED)
def create_user(user: schemas.CreateUser):
    try:
        connection = get_connection()
        new_user = db.create_user(
            connection,
            user.username,
            user.first_name,
            user.last_name,
            user.email,
            user.password,
            user.phone,
        )
        return new_user
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong:{error}",
        )


@app.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    try:
        connection = get_connection()
        user_by_id = db.get_user_by_id(connection, user_id)
        # Returns dictionary with all user data
        return user_by_id
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong {error}",
        )


# Radera användaren
@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    try:
        connection = get_connection()
        deleted_user = db.delete_user(connection, user_id)
        # Returns dictionary with deleted user's data, returns None if user doesn't exist
        return deleted_user
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong {error}",
        )


# Uppdatera användare (ändra senare tillfälle - ändra lösenord ska bli egen funktion för säk.skull)
@app.patch("/users/{user_id}")
def update_user(user_id: int, user: schemas.UserUpdate):
    try:
        connection = get_connection()
        updated_user = db.update_user(
            connection,
            user_id,
            user.email,
            user.phone,
            user.username,
            user.password,
            user.first_name,
            user.last_name,
        )
        return updated_user
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong {error}",
        )


# Logga in
@app.post("/login")
def login(data: schemas.UserLogin):
    connection = get_connection()
    user = db.get_user_by_email(connection, data.email)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")

    if user["password"] != data.password:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, detail="Wrong password")

    return {"message": "Login successful"}


# Logga ut (egentligen inte nödvnändig för backend)
@app.post("/logout")
def logout():
    return {"message": "Logged out successfully"}


# Worlds
@app.delete("/worlds/{world_id}")
def delete_world(world_id: int):
    with get_connection() as conn:
        deleted_world = db.delete_world(conn, world_id)
        return {"message": "World deleted successfully"}


# Locations - skapa plats
@app.post("/locations", status_code=status.HTTP_201_CREATED)
def create_location(location: schemas.CreateLocation, connection=Depends(get_db)):
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
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - hämta alla platser
@app.get("/locations")
def get_all_locations(connection=Depends(get_db)):
    try:
        all_locations = db.get_all_locations(connection)
        return all_locations
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - hämta specifik plats med id
@app.get("/locations/{location_id}")
def get_location_by_id(location_id: int, connection=Depends(get_db)):
    try:
        location = db.get_location_by_id(connection, location_id)
        if not location:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Location not found")
        return location
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - uppdatera plats
@app.patch("/locations/{location_id}")
def update_location(
    location_id: int, location: schemas.LocationUpdate, connection=Depends(get_db)
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
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Location not found")
        return updated_location
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Locations - radera en plats
@app.delete("/locations/{location_id}")
def delete_location(location_id: int, connection=Depends(get_db)):
    try:
        deleted_location = db.delete_location(connection, location_id)
        if not deleted_location:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Location not found")
        return {
            "message": "Location deleted successfully",
            "location": deleted_location,
        }
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Skapa föremål
@app.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(item: schemas.CreateItem, connection=Depends(get_db)):
    try:
        new_item = db.create_item(
            connection, item.item_name, item.item_description, item.world_id
        )
        return new_item
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Hämta alla föremål
@app.get("/items")
def get_all_items(connection=Depends(get_db)):
    try:
        all_items = db.get_all_items(connection)
        return all_items
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Hämta specifikt föremål med id
@app.get("/items/{item_id}")
def get_item_by_id(item_id: int, connection=Depends(get_db)):
    try:
        item = db.get_item_by_id(connection, item_id)
        if not item:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Item not found")
        return item
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Uppdatera föremål
@app.patch("/items/{item_id}")
def update_item(item_id: int, item: schemas.ItemUpdate, connection=Depends(get_db)):
    try:
        updated_item = db.update_item(
            connection, item_id, item.item_name, item.item_description
        )
        if not updated_item:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Item not found")
        return updated_item
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Items - Radera föremål
@app.delete("/items/{item_id}")
def delete_item(item_id: int, connection=Depends(get_db)):
    try:
        deleted_item = db.delete_item(connection, item_id)
        if not deleted_item:
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Item not found")
        return {"message": "Item deleted successfully", "item": deleted_item}
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong: {error}",
        )


# Species - Skapa varelse

# Species - Hämta alla varelser

# Species - Hämta specifikt varelse med id

# Species - Uppdatera varelse

# Species - Radera varelse


# Notes - Skapa anteckning

# Notes - Hämta alla anteckningar

# Notes - Hämta specifik anteckning med id

# Notes - Uppdatera anteckningar

# Notes - Radera anteckning
