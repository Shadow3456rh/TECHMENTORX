# policy/policy_engine.py

from urllib.parse import urlparse

ALLOWED_HOSTS = {
    "localhost",
    "127.0.0.1"
}

def is_target_allowed(target: str) -> bool:
    """
    Allow only localhost / 127.0.0.1 targets.
    Blocks everything else.
    """
    if not target:
        return False

    parsed = urlparse(target)

    host = parsed.hostname
    if host in ALLOWED_HOSTS:
        return True

    return False
