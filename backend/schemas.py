from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Using Pydantic setting to load and validate .env variables at startup
# Raises an error directly if a variable is missing
# Without this, missing variables return None and crash later in the code
class Settings(BaseSettings):
    DB_URL: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

# Post & patch endpoint, för när användaren ska skicka in sin data, behövs endast för fler fält som hör ihop.
# Grundmodell för klasser
class CreateUser(BaseModel):
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None

# Uppdatering av konto
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None

# Logga in
class UserLogin(BaseModel):
    email: str
    password: str

# Worlds
class CreateWorld(BaseModel):
    world_name: str
    world_description: str

class UpdateWorld(BaseModel):
    # Optional allows None as a value, = None makes the field not required
    world_name: Optional[str] = None
    world_description: Optional[str] = None

# Characters
class CreateCharacter(BaseModel):
    character_name: str
    character_description: str
    is_alive: bool = True
    image_id: Optional[int] = None
    species_id: Optional[int] = None
    item_id: Optional[int] = None

class UpdateCharacter(BaseModel):
    character_name: Optional[str] = None
    character_description: Optional[str] = None
    is_alive: Optional[bool] = True
    image_id: Optional[int] = None
    species_id: Optional[int] = None
    item_id: Optional[int] = None

# Relationships
class CreateRelationship(BaseModel):
    relationship_type: str
    character_a_id: int
    character_b_id: int

class UpdateRelationship(BaseModel):
    relationship_type: Optional[str] = None
    character_a_id: Optional[int] = None
    character_b_id: Optional[int] = None

# Events

# Character_events

# Maps
