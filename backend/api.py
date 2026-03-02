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

import os
import psycopg2
from db_setup import get_connection
from fastapi import FastAPI, HTTPException, status
import schemas
import db

app = FastAPI()

# Users - create account
@app.post("/users", status_code=201)
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
        raise HTTPException(status_code=500, detail=f"Something went wrong:{error}")


@app.get("/users/{user_id}")
def get_user_by_id(user_id: int):
    try:
        connection = get_connection()
        user_by_id = db.get_user_by_id(connection, user_id)
        # Returns dictionary with all user data
        return user_by_id
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Something went wrong {error}")


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
        raise HTTPException(status_code=500, detail=f"Something went wrong {error}")


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
        raise HTTPException(status_code=500, detail=f"Something went wrong {error}")


# Logga in
@app.post("/login")
def login(data: schemas.UserLogin):
    connection = get_connection()
    user = db.get_user_by_email(connection, data.email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Wrong password")

    return {"message": "Login successful"}


# Logga ut (egentligen inte nödvnändig för backend)
@app.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
