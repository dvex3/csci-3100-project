"""Endpoint tests for the file_ns namespace"""

import io

from flask import url_for

from tests.util import register_user, login_user


def upload_file(client, access_token, file_data, file_name, item_name):
    response = client.post(
        url_for("api.file_upload"),
        headers={"Authorization": f"Bearer {access_token}"},
        data={"file": (file_data, file_name), "name": item_name},
    )
    return response


def test_upload_post(client, db, upload_folder):
    register_user(client)
    response = login_user(client)
    assert "access_token" in response.json
    access_token = response.json["access_token"]
    with open("testfile.py", "rb") as f:
        file_data = f.read()
    response = upload_file(client, access_token, file_data, "testfile.py", "test_item")
    assert response.status_code == 200
    assert "item_name" in response.json and response.json["item_name"] == "test_item"
    assert "file_name" in response.json and response.json["file_name"] == "testfile.py"
    assert "parsed_map" in response.json


def test_upload_get(client, db, upload_folder):
    register_user(client)
    response = login_user(client)
    assert "access_token" in response.json
    access_token = response.json["access_token"]
    with open("testfile.py", "rb") as f:
        file_data = f.read()
    response = upload_file(client, access_token, file_data, "testfile.py", "test_item")
    assert response.status_code == 200
    response = client.get(
        url_for("api.file_upload"),
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.status_code == 200
    assert "info" in response.json
