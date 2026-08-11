from pathlib import Path
import os
import secrets

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_app_data_dir() -> Path:
    base_dir = os.getenv("APPDATA") or os.getenv("LOCALAPPDATA")
    if base_dir:
        return Path(base_dir) / "Garagem156A"
    return Path.home() / ".garagem156a"


def _sqlite_url(path: Path) -> str:
    return f"sqlite:///{path.resolve().as_posix()}"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "Garagem 156A"
    DEBUG: bool = False
    HOST: str = "127.0.0.1"
    PORT: int = 5000
    SITE_URL: str = "https://garagem156a.com.br"
    APP_DATA_DIR: str = str(_default_app_data_dir())
    SECRET_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 60 * 60 * 24
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    DATABASE_URL: str = ""

    @field_validator('CORS_ORIGINS', mode='before')
    @classmethod
    def validate_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(',') if origin.strip()]
        return value

    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    WHATSAPP_NUMBER: str = ""

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""

    MERCADO_PAGO_ACCESS_TOKEN: str = ""

    CORREIOS_API_URL: str = "https://api.correios.com.br"
    CORREIOS_API_KEY: str = ""

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, str):
            value_lower = value.strip().lower()
            if value_lower in ("true", "1", "yes", "on", "debug", "dev", "development"):
                return True
            if value_lower in ("false", "0", "no", "off", "release", "prod", "production"):
                return False
        return bool(value)

    def model_post_init(self, __context):
        data_dir = Path(self.APP_DATA_DIR)
        data_dir.mkdir(parents=True, exist_ok=True)

        if not self.DATABASE_URL:
            object.__setattr__(self, "DATABASE_URL", _sqlite_url(data_dir / "garagem_156a.db"))

        if not self.SECRET_KEY or self.SECRET_KEY == "sua-chave-secreta-aqui":
            secret_file = data_dir / ".secret_key"
            if secret_file.exists():
                secret_key = secret_file.read_text(encoding="utf-8").strip()
            else:
                secret_key = secrets.token_urlsafe(48)
                secret_file.write_text(secret_key, encoding="utf-8")
            object.__setattr__(self, "SECRET_KEY", secret_key)


settings = Settings()
