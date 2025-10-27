"""Flask CLI/Application entry point."""

import os

from annotator import create_app, db
from annotator.models.token_blacklist import BlacklistedToken
from annotator.models.user import User

app = create_app(os.getenv("FLASK_ENV", "development"))


@app.shell_context_processor
def shell():
    return {"db": db, "User": User, "BlacklistedToken": BlacklistedToken}
