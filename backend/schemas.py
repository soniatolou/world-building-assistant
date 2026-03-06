from pydantic import BaseModel, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


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


# Skapa plats
class CreateLocation(BaseModel):
    location_name: str
    location_description: str
    location_type: Optional[str] = None
    world_id: int
    map_id: int


# Uppdatera plats
class LocationUpdate(BaseModel):
    location_name: Optional[str] = None
    location_description: Optional[str] = None
    location_type: Optional[str] = None
    map_id: Optional[int] = None


# Items- skapa egna Items
class CreateItem(BaseModel):
    item_name: str
    item_description: str
    world_id: int


# Uppdatera sina Items
class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    item_description: Optional[str] = None


# Skapa karaktärer/varelser Species
class CreateSpecies(BaseModel):
    species_name: str
    species_description: str
    world_id: int


# Uppdatera varelse
class SpeciesUpdate(BaseModel):
    species_name: Optional[str] = None
    species_description: Optional[str] = None


# Skapa anteckningar
class CreateNote(BaseModel):
    note_name: str
    note_text: str
    user_id: int


# Uppdatera anteckningar
class NoteUpdate(BaseModel):
    note_name: Optional[str] = None
    note_text: Optional[str] = None
