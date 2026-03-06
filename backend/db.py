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
                INSERT 
                INTO worlds (world_name, world_description)
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
                SET 
                    world_name = COALESCE (%s, world_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
                    world_description = COALESCE (%s, world_description)
                WHERE world_id = %s
                RETURNING *;
                """,
                (world_name, world_description, world_id)
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
                (world_id,)
            )
            deleted_world = cursor.fetchone()
        return deleted_world


# Characters
def create_character(connection, world_id, character_name, character_description, is_alive=True, image_id=None, species_id=None, item_id=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT 
                INTO characters (
                    world_id, 
                    character_name, 
                    character_description, 
                    is_alive, 
                    image_id, 
                    species_id, 
                    item_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s) 
                RETURNING *; 
                """,
                (world_id, character_name, character_description, is_alive, image_id, species_id, item_id)
            )
            new_character = cursor.fetchone()
        return new_character 


def get_all_characters(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM characters;
                """
            )
            all_characters = cursor.fetchall()
        return all_characters


def get_character_by_id(connection, character_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM characters
                WHERE character_id = %s;
                """,
                (character_id,)
            )
            character = cursor.fetchone()
        return character


def update_character(connection, character_id, character_name=None, character_description=None, is_alive=None, image_id=None, species_id=None, item_id=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE characters
                SET 
                    character_name = COALESCE (%s, character_name),
                    character_description = COALESCE (%s, character_description),
                    is_alive = COALESCE (%s, is_alive),
                    image_id = COALESCE (%s, image_id),
                    species_id = COALESCE (%s, species_id),
                    item_id = COALESCE (%s, item_id)
                WHERE character_id = %s
                RETURNING *;
                """,
                (character_name, character_description, is_alive, image_id, species_id, item_id, character_id)
            )
            updated_character = cursor.fetchone()
        return updated_character


def delete_character(connection, character_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM characters
                WHERE character_id = %s
                RETURNING *;
                """,
                (character_id,)
            )
            deleted_character = cursor.fetchone()
        return deleted_character


# Relationships 
def create_relationship(connection, relationship_type, character_a_id, character_b_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT 
                INTO relationships (
                    relationship_type, 
                    character_a_id, 
                    character_b_id
                )
                VALUES (%s, %s, %s)
                RETURNING *;
                """,
                (relationship_type, character_a_id, character_b_id)
            )
            new_relationship = cursor.fetchone()
        return new_relationship


def get_relationships_for_character(connection, character_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT 
                    relationships.relationship_id,
                    relationships.relationship_type
                    a.character_name AS character_a_name, -- Gets the name on character a, renames the column to character_a_name --
                    b.character_name AS character_b_name
                FROM relationships
                JOIN characters a -- Joins characters-table, renames it a (character a) --
                ON relationships.character_a_id = a.character_id -- Connects it via character_a_id --
                JOIN characters b 
                ON relationships.character_b_id = b.character_id
                WHERE relationships.character_a_id = %s OR relationships.character_b_id = %s;
                """,
                (character_id, character_id)
            )
            relationships_for_character = cursor.fetchall()
        return relationships_for_character


def update_relationship(connection, relationship_id, relationship_type=None, character_a_id=None, character_b_id=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE relationships
                SET 
                    relationship_type = COALESCE (%s, relationship_type),
                    character_a_id = COALESCE (%s, character_a_id),
                    character_b_id = COALESCE (%s, character_b_id)
                WHERE relationship_id = %s
                RETURNING *;
                """,
                (relationship_type, character_a_id, character_b_id, relationship_id)
            )
            updated_relationship = cursor.fetchone()
        return updated_relationship


def delete_relationship(connection, relationship_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM relationships
                WHERE relationship_id = %s
                RETURNING *;
                """,
                (relationship_id,)
            )
            deleted_relationship = cursor.fetchone()
        return deleted_relationship

# Character_relationship - ta ev bort

# Events
def create_event(connection, world_id, event_name, event_description, event_date):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT 
                INTO events (
                    world_id, 
                    event_name, 
                    event_description, 
                    event_date
                )
                VALUES (%s, %s, %s, %s) 
                RETURNING *; 
                """,
                (world_id, event_name, event_description, event_date)
            )
            new_event = cursor.fetchone()
        return new_event 

# Character_events

# Locations - Sonia

# Items - Sonia

# Species - Sonia

# Notes - Sonia

# 

def update_event(connection, event_id, event_name=None, event_description=None, event_date=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE events
                SET
                    event_name = COALESCE (%s, event_name),
                    event_description = COALESCE (%s, event_description),
                    event_date = COALESCE (%s, event_date),
                WHERE event_id = %s
                RETURNING *; 
                """,
                (event_name, event_description, event_date, event_id)
            )
            updated_event = cursor.fetchone()
        return updated_event 


def get_all_events(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM events
                WHERE world_id = %s
                """,
                (world_id,)
            )
            all_events = cursor.fetchall()
        return all_events


def get_event_by_id(connection, event_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM events
                WHERE event_id = %s;
                """,
                (event_id,)
            )
            event = cursor.fetchone()
        return event


def delete_event(connection, event_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM events
                WHERE event_id = %s
                RETURNING *;
                """,
                (event_id,)
            )
            deleted_event = cursor.fetchone()
        return deleted_event

# Character_events
def add_character_to_event(connection, event_id, character_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT
                INTO character_events (event_id, character_id)
                VALUES (%s, %s)
                RETURNING *;
                """,
                (event_id, character_id)
            )
            added_character_to_event = cursor.fetchone()
        return added_character_to_event


def remove_character_from_event(connection, event_id, character_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM character_events (
                WHERE event_id = %s AND character_id = %s)
                RETURNING *;
                """,
                (event_id, character_id)
            )
            removed_character_from_event = cursor.fetchone()
        return removed_character_from_event


def get_all_characters_for_event(connection, event_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM character_events
                JOIN characters
                ON character_events.character_id = characters.character_id
                WHERE character_events.event_id = %s;
                """,
                (event_id,)
            )
            all_characters_in_event = cursor.fetchall()
        return all_characters_in_event


def get_all_events_for_one_character(connection, character_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM character_events
                JOIN events
                ON character_events.event_id = events.event_id
                WHERE character_events.character_id = %s;
                """,
                (character_id,)
            )
            all_events_for_one_character = cursor.fetchall()
        return all_events_for_one_character


# Maps
def create_map(connection, world_id, map_name, map_url, scale_factor=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT 
                INTO maps (
                    world_id, 
                    map_name,
                    map_url,
                    scale_factor
                )
                VALUES (%s, %s, %s, %s) 
                RETURNING *; 
                """,
                (world_id, map_name, map_url, scale_factor)
            )
            new_map = cursor.fetchone()
        return new_map 


def get_all_maps_for_one_world(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM maps
                WHERE world_id = %s;
                """,
                (world_id,)
            )
            all_maps = cursor.fetchall()
        return all_maps


def get_map_by_id(connection, map_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM maps
                WHERE map_id = %s;
                """,
                (map_id,)
            )
            map_by_id = cursor.fetchone()
        return map_by_id


def update_map(connection, map_id, map_name=None, map_url=None, scale_factor=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE maps
                SET
                    map_name = COALESCE (%s, map_name),
                    map_url = COALESCE (%s, map_url),
                    scale_factor = COALESCE (%s, scale_factor),
                WHERE map_id = %s
                RETURNING *; 
                """,
                (map_name, map_url, scale_factor, map_id)
            )
            updated_map = cursor.fetchone()
        return updated_map 


def delete_map(connection, map_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM maps
                WHERE map_id = %s
                RETURNING *;
                """,
                (map_id,)
            )
            deleted_map = cursor.fetchone()
        return deleted_map

