from pydantic import BaseModel, EmailStr
from typing import Optional


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
