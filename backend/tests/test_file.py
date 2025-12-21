"""Endpoint tests for the file_ns namespace"""

import io

from flask import url_for

from tests.util import register_user, login_user


def upload_file(client, access_token, file, file_name, item_name):
    response = client.post(
        url_for("api.upload_file"),
        headers={"Authorization": f"Bearer {access_token}"},
        data={"file": (file, file_name), "name": item_name},
    )
    return response


def test_upload_post(client, db):
    register_user(client)
    response = login_user(client)
    assert "access_token" in response.json
    access_token = response.json["access_token"]
    file = io.BytesIO(b"some initial text data")
    response = upload_file(client, access_token, file, "test_file", "test_item")
    assert response.status_code == 200
    assert "item_name" in response and response["item_name"] == "test_item"
    assert "file_name" in response and response["file_name"] == "test_file"
