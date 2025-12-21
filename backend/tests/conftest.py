"""Global pytest fixtures."""

import pytest

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
def user_file(db):
    user = User(email=EMAIL, password=PASSWORD)
    db.session.add(user)
    db.session.commit()
    return user
