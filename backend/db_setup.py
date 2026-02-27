import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(override=True)

DATABASE_NAME = os.getenv("DATABASE_NAME")
PASSWORD = os.getenv("PASSWORD")
USER = os.getenv("DATABASE_USER")
HOST = os.getenv("DATABASE_HOST")
PORT = os.getenv("DATABASE_PORT")


def get_connection():
    return psycopg2.connect(
        dbname=DATABASE_NAME,
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
    )


def create_tables():
    connection = get_connection()
    cursor = connection.cursor()

    # Users
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "users" (
        user_id BIGSERIAL PRIMARY KEY NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR (255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
        );
        """
    )

    # Worlds
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "worlds" (
        world_id BIGSERIAL PRIMARY KEY NOT NULL,
        world_name VARCHAR(255) NOT NULL,
        world_description TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        user_id BIGINT NOT NULL REFERENCES "users"(user_id)
        );
        """
    )

    # Events
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "events" (
        event_id BIGSERIAL PRIMARY KEY NOT NULL,
        event_name VARCHAR(255) NOT NULL,
        event_description TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Items
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "items" (
        item_id BIGSERIAL PRIMARY KEY NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_description TEXT NOT NULL,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Junction table world_items
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "world_items" (
        item_id BIGINT NOT NULL REFERENCES "items"(item_id),
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Species
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "species" (
        species_id BIGSERIAL PRIMARY KEY NOT NULL,
        species_name VARCHAR(255) NOT NULL,
        species_description TEXT NOT NULL,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Junction table world_species
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "world_species" (
        species_id BIGINT NOT NULL REFERENCES "species"(species_id),
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Notes
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "notes" (
        notes_id BIGSERIAL PRIMARY KEY NOT NULL,
        note_name VARCHAR(255) NOT NULL,
        note_text TEXT NOT NULL,
        user_id BIGINT NOT NULL REFERENCES "users"(user_id)
        );
        """
    )

    # Tags
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "tags" (
        tag_id BIGSERIAL PRIMARY KEY NOT NULL,
        tag_name VARCHAR(100) NOT NULL,
        category VARCHAR(100)
        );
        """
    )

    # Entity_tags
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "entity_tags" (
        entity_id BIGSERIAL PRIMARY KEY NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        tag_id BIGINT NOT NULL REFERENCES "tags"(tag_id)
        );
        """
    )

    # # Embeddings
    #     cursor.execute(
    #         """
    #         CREATE TABLE IF NOT EXISTS "embeddings" (
    #         embedding_id BIGSERIAL PRIMARY KEY NOT NULL,
    #         vector_data VECTOR(1536)
    #         );
    #         """
    #     )

    # Images
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "images" (
        image_id BIGSERIAL PRIMARY KEY NOT NULL,
        image_url VARCHAR(2048) NOT NULL
        );
        """
    )

    # Maps
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "maps" (
        map_id BIGSERIAL PRIMARY KEY NOT NULL,
        map_name VARCHAR(255) NOT NULL,
        scale_factor FLOAT,
        map_url VARCHAR(2048),
        image_id BIGINT NOT NULL REFERENCES "images"(image_id),
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Locations
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "locations" (
        location_id BIGSERIAL PRIMARY KEY NOT NULL,
        loaction_name VARCHAR(255) NOT NULL,
        location_description TEXT NOT NULL,
        location_type VARCHAR(100),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id),
        map_id BIGINT NOT NULL REFERENCES "maps"(map_id)
        );
        """
    )

    # Characters
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "characters" (
        character_id BIGSERIAL PRIMARY KEY NOT NULL,
        character_name VARCHAR(255) NOT NULL,
        character_description TEXT NOT NULL,
        is_alive BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id),
        image_id BIGINT NOT NULL REFERENCES "images"(image_id),
        species_id BIGINT NOT NULL REFERENCES "species"(species_id),
        item_id BIGINT NOT NULL REFERENCES "items"(item_id)
        );
        """
    )

    # Relationships
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "relationships" (
        relationship_id BIGSERIAL PRIMARY KEY NOT NULL,
        character_a_id BIGINT NOT NULL REFERENCES "characters"(character_id),
        character_b_id BIGINT NOT NULL REFERENCES "characters"(character_id),
        relationship_type VARCHAR(255) NOT NULL
        );
        """
    )

    # Junction table character_relationships
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "character_relationships" (
        character_id BIGINT NOT NULL REFERENCES "characters"(character_id),
        relationship_id BIGINT NOT NULL REFERENCES "relationships"(relationship_id)
        );
        """
    )

    # Junction table character_events
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "character_events" (
        character_id BIGINT NOT NULL REFERENCES "characters"(character_id),
        event_id BIGINT NOT NULL REFERENCES "events"(event_id)
        );
        """
    )

    connection.commit()
    cursor.close()
    connection.close()


if __name__ == "__main__":
    create_tables()
    print("Tables created successfully.")
