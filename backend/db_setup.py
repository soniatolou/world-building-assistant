import psycopg2
import settings

settings = settings.Settings()

def get_connection():
    return psycopg2.connect(settings.DB_URL)

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
        password VARCHAR(60) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "sessions" (
        session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 days'
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
        image_url VARCHAR (2048),
        user_id BIGINT NOT NULL REFERENCES "users"(user_id)
        );
        """
    )

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "world_rules" (
        rule_id BIGSERIAL PRIMARY KEY NOT NULL,
        rule_text TEXT NOT NULL,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
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
        start_year VARCHAR(20),
        end_year VARCHAR (20),
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
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id),
        PRIMARY KEY (item_id, world_id)
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
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id),
        PRIMARY KEY (species_id, world_id)
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
        map_description TEXT,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id)
        );
        """
    )

    # Locations
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "locations" (
        location_id BIGSERIAL PRIMARY KEY NOT NULL,
        location_name VARCHAR(255) NOT NULL,
        location_description TEXT NOT NULL,
        location_type VARCHAR(100),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id),
        map_id BIGINT REFERENCES "maps"(map_id)
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
        birth_year VARCHAR(20),
        is_alive BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        image_url VARCHAR (2048),
        world_id BIGINT NOT NULL REFERENCES "worlds"(world_id),
        image_id BIGINT REFERENCES "images"(image_id),
        species_id BIGINT REFERENCES "species"(species_id),
        item_id BIGINT REFERENCES "items"(item_id)
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

    # Junction table character_events
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "character_events" (
        character_id BIGINT NOT NULL REFERENCES "characters"(character_id),
        event_id BIGINT NOT NULL REFERENCES "events"(event_id),
        PRIMARY KEY (character_id, event_id)
        );
        """
    )

    connection.commit()
    cursor.close()
    connection.close()

if __name__ == "__main__":
    create_tables()
    print("Tables created successfully.")
