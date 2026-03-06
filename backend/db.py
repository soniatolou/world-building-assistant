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
                (world_name, world_description),
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
                (world_id,),
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
                (world_id, world_name, world_description),
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
                (world_id),
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
                SET note_name = COALESCE (%s, note_name), -- COALESCE: use the new value if updated, otherwise keep the old one --
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


# Images - Sonia
def create_image(connection, image_url):
    """Spara image URL i databasen efter file upload"""
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


# Junction tables queries
def get_items_by_world(connection, world_id):
    """Hämta alla items som tillhör en specifik värld via junction table"""
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
    """Hämta alla species som tillhör en specifik värld via junction table"""
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
