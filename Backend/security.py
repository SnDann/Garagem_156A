from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from werkzeug.security import check_password_hash, generate_password_hash

from config import settings

TOKEN_SALT = "garagem-156a-auth"


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    if not password or not password_hash:
        return False
    return check_password_hash(password_hash, password)


def _serializer() -> URLSafeTimedSerializer:
    return URLSafeTimedSerializer(settings.SECRET_KEY, salt=TOKEN_SALT)


def create_access_token(payload: dict) -> str:
    return _serializer().dumps(payload)


def decode_access_token(token: str) -> dict:
    try:
        return _serializer().loads(token, max_age=settings.ACCESS_TOKEN_EXPIRE_SECONDS)
    except SignatureExpired as exc:
        raise ValueError("Token expirado") from exc
    except BadSignature as exc:
        raise ValueError("Token invalido") from exc
