import anthropic
import json
from app.settings import settings

def run_consistency_check(world_id: int, connection):
    # Gets world data from the database
    with connection.cursor() as cursor:
        cursor.execute("SELECT rule_text FROM world_rules WHERE world_id = %s", (world_id,))
        world_rules = cursor.fetchall()

        cursor.execute("SELECT character_name, character_description, birth_year, is_alive FROM characters WHERE world_id = %s", (world_id,))
        characters = cursor.fetchall()

        cursor.execute("SELECT event_name, event_description, start_year, end_year FROM events WHERE world_id = %s", (world_id,))
        events = cursor.fetchall()

        cursor.execute("SELECT location_name, location_description FROM locations WHERE world_id = %s", (world_id,))
        locations = cursor.fetchall()

        cursor.execute("SELECT item_name, item_description FROM items WHERE world_id = %s", (world_id,))
        items = cursor.fetchall()

        cursor.execute("SELECT species_name, species_description FROM species WHERE world_id = %s", (world_id,))
        species = cursor.fetchall()

        cursor.execute("""
            SELECT c.character_name, e.event_name
            FROM character_events ce
            JOIN characters c ON c.character_id = ce.character_id
            JOIN events e ON e.event_id = ce.event_id
            WHERE c.world_id = %s
        """, (world_id,))
        character_events = cursor.fetchall()

        cursor.execute("""
            SELECT c1.character_name, r.relationship_type, c2.character_name AS related_to
            FROM relationships r
            JOIN characters c1 ON c1.character_id = r.character_a_id
            JOIN characters c2 ON c2.character_id = r.character_b_id
            WHERE c1.world_id = %s
        """, (world_id,))
        relationships = cursor.fetchall()

    # Puts everything in a dictionary
    world_data = {
        "world_rules": world_rules,
        "characters": characters,
        "events": events,
        "locations": locations,
        "items": items,
        "species": species,
        "character_events": character_events,
        "relationships": relationships
    }

    client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"""
            You are a consistency checker for a fantasy-world.
            Analyze the world data and find logical contradictions. 
            Do not stop after finding the first contradiction. 
            Return ALL contradictions you find, not just the most obvious ones.

            WORLDDATA:
            {json.dumps(world_data, ensure_ascii=False, indent=2)}

            Do not wrap the JSON in markdown code blocks. Return only raw JSON:
            {{
            "contradictions": [
                {{
                "description": "what the contradiction is",
                "elements_involved": ["element1", "element2"],
                "suggestion": "how the contradiction can be resolved"
                }}
            ]
            }}
            If there are no contradictions, return {{"contradictions": []}}
            """
        }]
    )

    raw = response.content[0].text
    clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(clean) # Converts JSON to a Python-object