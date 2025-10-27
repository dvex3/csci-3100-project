"""Flask CLI/Application entry point."""

import os

from annotator import create_app, db
from annotator.models.token_blacklist import BlacklistedToken
from annotator.models.user import User
from annotator.models.liscense_key import LicenseKey

app = create_app(os.getenv("FLASK_ENV", "development"))


@app.shell_context_processor
def shell():
    return {
        "db": db,
        "User": User,
        "BlacklistedToken": BlacklistedToken,
        "LicenseKey": LicenseKey,
    }
