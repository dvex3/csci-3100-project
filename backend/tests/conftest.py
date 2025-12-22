"""Global pytest fixtures."""

import shutil

import pytest
import os

import annotator
from annotator import create_app
from annotator import db as database
from annotator.models.liscense_key import LicenseKey
from annotator.models.user import User
from tests.util import EMAIL, PASSWORD, LICENSE_KEY


@pytest.fixture
def app():
    app = create_app("testing")
    return app


@pytest.fixture
def db(app, client, request):
    database.drop_all()
    database.create_all()
    database.session.add(LicenseKey(key=LICENSE_KEY))
    database.session.commit()

    def fin():
        database.session.remove()

    request.addfinalizer(fin)
    return database


@pytest.fixture
def user(db):
    user = User(email=EMAIL, password=PASSWORD)
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def upload_folder(app):
    folder = app.config["UPLOAD_FOLDER"]
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print("Failed to delete %s. Reason: %s" % (file_path, e))
