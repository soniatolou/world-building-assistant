from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserResponse(BaseModel):
    user_id: int
    username: str
    first_name: str
    last_name: str
    email: str

class CreateUser(BaseModel):
    username: str = Field(min_length=1)
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr = Field(min_length=1)
    password: str = Field(min_length=1)

class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None, min_length=1)
    first_name: Optional[str] = Field(default=None, min_length=1)
    last_name: Optional[str] = Field(default=None, min_length=1)
    email: Optional[str] = Field(default=None, min_length=1)

class UserLogin(BaseModel):
    email: str = Field(min_length=1)
    password: str = Field(min_length=1)


# Skapa plats
class CreateLocation(BaseModel):
    location_name: str
    location_description: str
    location_type: Optional[str] = None
    image_url: Optional[str] = None
    world_id: int
    map_id: Optional[int] = None


# Uppdatera plats
class LocationUpdate(BaseModel):
    location_name: Optional[str] = None
    location_description: Optional[str] = None
    location_type: Optional[str] = None
    image_url: Optional[str] = None
    map_id: Optional[int] = None


# Items- skapa egna Items
class CreateItem(BaseModel):
    item_name: str
    item_description: str
    image_url: Optional[str] = None
    world_id: int


# Uppdatera sina Items
class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    item_description: Optional[str] = None
    image_url: Optional[str] = None


# Skapa karaktärer/varelser Species
class CreateSpecies(BaseModel):
    species_name: str
    species_description: str
    image_url: Optional[str] = None
    world_id: int


# Uppdatera varelse
class SpeciesUpdate(BaseModel):
    species_name: Optional[str] = None
    species_description: Optional[str] = None
    image_url: Optional[str] = None


# Skapa anteckningar
class CreateNote(BaseModel):
    note_name: str
    note_text: str


# Uppdatera anteckningar
class NoteUpdate(BaseModel):
    note_name: Optional[str] = None
    note_text: Optional[str] = None

# Worlds
class CreateWorld(BaseModel):
    world_name: str = Field(min_length=1)
    world_description: Optional[str] = None
    image_url: Optional[str] = None

class CreateRule(BaseModel):
    rule_text: str = Field(min_length=1)

class UpdateRule(BaseModel):
    rule_text: Optional[str] = None

class UpdateWorld(BaseModel):
    # Optional allows None as a value, = None makes the field not required
    world_name: Optional[str] = None
    world_description: Optional[str] = None
    image_url: Optional[str] = None

# Characters
class CreateCharacter(BaseModel):
    character_name: str = Field(min_length=1)
    character_description: Optional[str] = None
    birth_year: Optional[str] = None
    death_year: Optional[str] = None
    is_alive: bool = True
    image_url: Optional[str] = None
    image_id: Optional[int] = None
    species_id: Optional[int] = None
    item_id: Optional[int] = None

class UpdateCharacter(BaseModel):
    character_name: Optional[str] = None
    character_description: Optional[str] = None
    birth_year: Optional[str] = None
    death_year: Optional[str] = None
    is_alive: Optional[bool] = True
    image_url: Optional[str] = None
    image_id: Optional[int] = None
    species_id: Optional[int] = None
    item_id: Optional[int] = None

# Relationships
class CreateRelationship(BaseModel):
    relationship_type: str = Field(min_length=1)
    character_a_id: int
    character_b_id: int

class UpdateRelationship(BaseModel):
    relationship_type: Optional[str] = None
    character_a_id: Optional[int] = None
    character_b_id: Optional[int] = None

# Events
class CreateEvent(BaseModel):
    event_name: str = Field(min_length=1)
    event_description: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None

class UpdateEvent(BaseModel):
    event_name: Optional[str] = None
    event_description: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None

# Maps
class CreateMap(BaseModel):
    map_name: str = Field(min_length=1)
    map_url: str = Field(min_length=1)
    map_description: Optional[str] = None
    scale_factor: Optional[float] = None

class UpdateMap(BaseModel):
    map_name: Optional[str] = None
    map_url: Optional[str] = None
    scale_factor: Optional[float] = None
    map_description: Optional[str] = None

# Locations
class CreateLocation(BaseModel):
    location_name: str = Field(min_length=1)
    location_description: Optional[str] = None
    location_type: Optional[str] = None
    world_id: int
    map_id: Optional[int] = None

class LocationUpdate(BaseModel):
    location_name: Optional[str] = None
    location_description: Optional[str] = None
    location_type: Optional[str] = None
    map_id: Optional[int] = None

# Items
class CreateItem(BaseModel):
    item_name: str = Field(min_length=1)
    item_description: Optional[str] = None
    world_id: int

class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    item_description: Optional[str] = None

# Species
class CreateSpecies(BaseModel):
    species_name: str = Field(min_length=1)
    species_description: Optional[str] = None
    world_id: int

class SpeciesUpdate(BaseModel):
    species_name: Optional[str] = None
    species_description: Optional[str] = None

# Notes
class CreateNote(BaseModel):
    note_name: str = Field(min_length=1)
    note_text: str

class NoteUpdate(BaseModel):
    note_name: Optional[str] = None
    note_text: Optional[str] = None
