from psycopg2.extras import RealDictCursor
# RealDictCursor returns dicts instead of tuples, so that the values can be accessed by name instead of index
# Since API returns JSON, it is easier to work with dicts

"""
Database functions for World Building Assistant API.
Each function execute a query and returns the result.
"""

# Worlds
def create_world(connection, world_name, world_description):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO worlds (world_name, world_description)
                VALUES (%s, %s) -- Placeholders to prevent SQL injection, psycopg2 inserts values safely --
                RETURNING *; -- Returns all columns of the newly created row --
                """,
                (world_name, world_description)
            )
            new_world = cursor.fetchone()
        return new_world 

def get_all_worlds(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM worlds;
                """
            )
            all_worlds = cursor.fetchall()
        return all_worlds

def get_world_by_id(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM worlds
                WHERE world_id = %s;
                """,
                (world_id,)
            )
            world = cursor.fetchone()
        return world

def update_world(connection, world_id, world_name=None, world_description=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE worlds
                SET world_name = COALESCE (%s, world_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
                world_description = COALESCE (%s, world_description)
                WHERE world_id = %s
                RETURNING *;
                """,
                (world_id, world_name, world_description)
            )
            updated_world = cursor.fetchone()
        return updated_world

def delete_world(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM worlds
                WHERE world_id = %s
                RETURNING *;
                """,
                (world_id)
            )
            deleted_world = cursor.fetchone()
        return deleted_world

# Maps

# Characters

# Relationships 

# Character_relationship

# Events

# Character_events

# Locations - Sonia

# Items - Sonia

# Species - Sonia

# Notes - Sonia

# 