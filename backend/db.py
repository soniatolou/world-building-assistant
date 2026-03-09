from psycopg2.extras import RealDictCursor

# RealDictCursor returns dicts instead of tuples, so that the values can be accessed by name instead of index
# Since API returns JSON, it is easier to work with dicts

"""
Database functions for World Building Assistant API.
Each function execute a query and returns the result.
"""

# Worlds
def create_world(connection, user_id, world_name, world_description, image_url=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT 
                INTO worlds (user_id, world_name, world_description, image_url)
                VALUES (%s, %s, %s, %s) -- Placeholders to prevent SQL injection, psycopg2 inserts values safely --
                RETURNING *; -- Returns all columns of the newly created row --
                """,
                (user_id, world_name, world_description, image_url)
            )
            new_world = cursor.fetchone()
        return new_world 


def get_all_worlds(connection, user_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM worlds;
                WHERE user_id = %s;
                """,
                (user_id,)
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


def update_world(connection, world_id, world_name=None, world_description=None, image_url=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE worlds
                SET 
                    world_name = COALESCE (%s, world_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
                    world_description = COALESCE (%s, world_description),
                    image_url = COALESCE (%s, image_url)
                WHERE world_id = %s
                RETURNING *;
                """,
                (world_name, world_description, image_url, world_id)
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
def create_character(connection, world_id, character_name, character_description, is_alive=True, image_url=None, image_id=None, species_id=None, item_id=None):
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
                    image_url,
                    image_id, 
                    species_id, 
                    item_id
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) 
                RETURNING *; 
                """,
                (world_id, character_name, character_description, is_alive, image_url, image_id, species_id, item_id)
            )
            new_character = cursor.fetchone()
        return new_character 


def get_all_characters(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM characters
                WHERE world_id = %s;
                """,
                (world_id,)
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


def update_character(connection, character_id, character_name=None, character_description=None, is_alive=None, image_url=None, image_id=None, species_id=None, item_id=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE characters
                SET 
                    character_name = COALESCE (%s, character_name),
                    character_description = COALESCE (%s, character_description),
                    is_alive = COALESCE (%s, is_alive),
                    image_url = COALESCE (%s, image_url),
                    image_id = COALESCE (%s, image_id),
                    species_id = COALESCE (%s, species_id),
                    item_id = COALESCE (%s, item_id)
                WHERE character_id = %s
                RETURNING *;
                """,
                (character_name, character_description, is_alive, image_url, image_id, species_id, item_id, character_id)
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
                    relationships.relationship_type,
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


def update_event(connection, event_id, event_name=None, event_description=None, event_date=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE events
                SET
                    event_name = COALESCE (%s, event_name),
                    event_description = COALESCE (%s, event_description),
                    event_date = COALESCE (%s, event_date)
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
                FROM character_events
                WHERE event_id = %s AND character_id = %s
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
def create_map(connection, world_id, map_name, map_url, map_description=None, scale_factor=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT 
                INTO maps (
                    world_id, 
                    map_name,
                    map_url,
                    map_description,
                    scale_factor
                )
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING *; 
                """,
                (world_id, map_name, map_url, map_description, scale_factor)
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


def update_map(connection, map_id, map_name=None, map_url=None, map_description=None, scale_factor=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE maps
                SET
                    map_name = COALESCE (%s, map_name),
                    map_url = COALESCE (%s, map_url),
                    map_description = COALESCE (%s, map_description),
                    scale_factor = COALESCE (%s, scale_factor)
                WHERE map_id = %s
                RETURNING *; 
                """,
                (map_name, map_url, map_description, scale_factor, map_id)
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


# Locations - Sonia
def create_location(
    connection,
    location_name,
    location_description,
    world_id,
    map_id,
    location_type=None,
):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO locations (location_name, location_description, world_id, map_id, location_type)
                VALUES (%s, %s, %s, %s, %s) -- Placeholders to prevent SQL injection, psycopg2 inserts values safely --
                RETURNING *; -- Returns all columns of the newly created row --
                """,
                (location_name, location_description, world_id, map_id, location_type),
            )
            new_location = cursor.fetchone()
        return new_location


def get_all_locations(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM locations;
                """
            )
            all_locations = cursor.fetchall()
        return all_locations


def get_location_by_id(connection, location_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM locations
                WHERE location_id = %s;
                """,
                (location_id,),
            )
            location = cursor.fetchone()
        return location


def update_location(
    connection,
    location_id,
    location_name=None,
    location_description=None,
    location_type=None,
    map_id=None,
):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE locations
                SET location_name = COALESCE (%s, location_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
                location_description = COALESCE (%s, location_description),
                location_type = COALESCE (%s, location_type),
                map_id = COALESCE (%s, map_id),
                updated_at = CURRENT_TIMESTAMP
                WHERE location_id = %s
                RETURNING *;
                """,
                (
                    location_name,
                    location_description,
                    location_type,
                    map_id,
                    location_id,
                ),
            )
            updated_location = cursor.fetchone()
        return updated_location


def delete_location(connection, location_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM locations
                WHERE location_id = %s
                RETURNING *;
                """,
                (location_id,),
            )
            deleted_location = cursor.fetchone()
        return deleted_location


# Items - Sonia
def create_item(connection, item_name, item_description, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO items (item_name, item_description, world_id)
                VALUES (%s, %s, %s) -- Placeholders to prevent SQL injection, psycopg2 inserts values safely --
                RETURNING *; -- Returns all columns of the newly created row --
                """,
                (item_name, item_description, world_id),
            )
            new_item = cursor.fetchone()
        return new_item


def get_all_items(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM items;
                """
            )
            all_items = cursor.fetchall()
        return all_items


def get_item_by_id(connection, item_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM items
                WHERE item_id = %s;
                """,
                (item_id,),
            )
            item = cursor.fetchone()
        return item


def update_item(connection, item_id, item_name=None, item_description=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE items
                SET item_name = COALESCE (%s, item_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
                item_description = COALESCE (%s, item_description)
                WHERE item_id = %s
                RETURNING *;
                """,
                (item_name, item_description, item_id),
            )
            updated_item = cursor.fetchone()
        return updated_item


def delete_item(connection, item_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM items
                WHERE item_id = %s
                RETURNING *;
                """,
                (item_id,),
            )
            deleted_item = cursor.fetchone()
        return deleted_item


# Species - Sonia
def create_species(connection, species_name, species_description, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO species (species_name, species_description, world_id)
                VALUES (%s, %s, %s) -- Placeholders to prevent SQL injection, psycopg2 inserts values safely --
                RETURNING *; -- Returns all columns of the newly created row --
                """,
                (species_name, species_description, world_id),
            )
            new_species = cursor.fetchone()
        return new_species


def get_all_species(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM species;
                """
            )
            all_species = cursor.fetchall()
        return all_species


def get_species_by_id(connection, species_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM species
                WHERE species_id = %s;
                """,
                (species_id,),
            )
            species = cursor.fetchone()
        return species


def update_species(connection, species_id, species_name=None, species_description=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE species
                SET species_name = COALESCE (%s, species_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
                species_description = COALESCE (%s, species_description)
                WHERE species_id = %s
                RETURNING *;
                """,
                (species_name, species_description, species_id),
            )
            updated_species = cursor.fetchone()
        return updated_species


def delete_species(connection, species_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM species
                WHERE species_id = %s
                RETURNING *;
                """,
                (species_id,),
            )
            deleted_species = cursor.fetchone()
        return deleted_species


# Notes - Sonia
def create_note(connection, note_name, note_text, user_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO notes (note_name, note_text, user_id)
                VALUES (%s, %s, %s) -- Placeholders to prevent SQL injection, psycopg2 inserts values safely --
                RETURNING *; -- Returns all columns of the newly created row --
                """,
                (note_name, note_text, user_id),
            )
            new_note = cursor.fetchone()
        return new_note


def get_all_notes(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM notes;
                """
            )
            all_notes = cursor.fetchall()
        return all_notes


def get_note_by_id(connection, notes_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM notes
                WHERE notes_id = %s;
                """,
                (notes_id,),
            )
            note = cursor.fetchone()
        return note


def update_note(connection, notes_id, note_name=None, note_text=None):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE notes
                SET note_name = COALESCE (%s, note_name),
                    note_text = COALESCE (%s, note_text)
                WHERE notes_id = %s
                RETURNING *;
                """,
                (note_name, note_text, notes_id),
            )
            updated_note = cursor.fetchone()
        return updated_note


def delete_note(connection, notes_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM notes
                WHERE notes_id = %s
                RETURNING *;
                """,
                (notes_id,),
            )
            deleted_note = cursor.fetchone()
        return deleted_note


# Images
def create_image(connection, image_url):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                INSERT INTO images (image_url)
                VALUES (%s)
                RETURNING *;
                """,
                (image_url,),
            )
            new_image = cursor.fetchone()
        return new_image


def get_all_images(connection):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM images;
                """
            )
            all_images = cursor.fetchall()
        return all_images


def get_image_by_id(connection, image_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT *
                FROM images
                WHERE image_id = %s;
                """,
                (image_id,),
            )
            image = cursor.fetchone()
        return image


def update_image(connection, image_id, image_url):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                UPDATE images
                SET image_url = %s
                WHERE image_id = %s
                RETURNING *;
                """,
                (image_url, image_id),
            )
            updated_image = cursor.fetchone()
        return updated_image


def delete_image(connection, image_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                DELETE
                FROM images
                WHERE image_id = %s
                RETURNING *;
                """,
                (image_id,),
            )
            deleted_image = cursor.fetchone()
        return deleted_image


# Junction tables
def get_items_by_world(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT i.*
                FROM items i
                INNER JOIN world_items wi ON i.item_id = wi.item_id
                WHERE wi.world_id = %s;
                """,
                (world_id,),
            )
            items = cursor.fetchall()
        return items


def get_species_by_world(connection, world_id):
    with connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT s.*
                FROM species s
                INNER JOIN world_species ws ON s.species_id = ws.species_id
                WHERE ws.world_id = %s;
                """,
                (world_id,),
            )
            species = cursor.fetchall()
        return species
