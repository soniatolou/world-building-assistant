from pydantic_settings import BaseSettings, SettingsConfigDict

# Using Pydantic setting to load and validate .env variables at startup
# Raises an error directly if a variable is missing
# Without this, missing variables return None and crash later in the code
class Settings(BaseSettings):
    DB_URL: str
    ANTHROPIC_API_KEY: str
    CORS_ORIGINS: str = "http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()