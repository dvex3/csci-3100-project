"""Business logic for /file API endpoints."""

import os
from http import HTTPStatus
from uuid import uuid4

from flask import current_app
from flask_restx import abort
from werkzeug.datastructures import FileStorage

import annotator
from annotator import db
from annotator.api.auth.decorators import token_required
from annotator.models.file import File
from annotator.models.user import User
from annotator.util.datetime_util import localized_dt_string


@token_required
def process_file_upload(name: str, file: FileStorage):

    owner_id = process_file_upload.public_id
    owner = User.find_by_public_id(owner_id)
    item_name = name
    file_name = file.filename
    uuid = str(uuid4())
    file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], uuid))
    new_file_info = File(
        uuid=uuid,
        item_name=item_name,
        file_name=file_name,
        owner_id=owner_id,
        owner=owner,
    )
    db.session.add(new_file_info)
    db.session.commit()
    file_info = File.find_by_uuid(uuid)
    return dict(
        uuid=file.uuid,
        created_at=localized_dt_string(file_info.created_at),
        item_name=item_name,
        file_name=file_name,
        owner_id=owner_id,
    )


@token_required
def get_file_info():
    user_id = get_file_info.public_id
    files = File.find_by_user_id(user_id)
    output = []
    for file in files:
        output.append(file.as_dict())
    return dict(
        info=output,
    )


@token_required
def get_file_content(uuid):
    owner_id = get_file_content.public_id
    file = File.find_by_uuid(uuid)
    if not file:
        abort(HTTPStatus.NOT_FOUND, "File not found", status="fail")
    if file.owner_id != owner_id:
        abort(
            HTTPStatus.UNAUTHORIZED, "File does not belong to this user.", status="fail"
        )
    f = open(os.path.join(current_app.config["UPLOAD_FOLDER"], uuid))
    content = f.read()
    f.close()
    return dict(
        content=content,
    )


@token_required
def delete_file(uuid):
    owner_id = delete_file.public_id
    file = File.find_by_uuid(uuid)
    if not file:
        abort(HTTPStatus.NOT_FOUND, "File not found", status="fail")
    if file.owner_id != owner_id:
        abort(
            HTTPStatus.UNAUTHORIZED, "File does not belong to this user.", status="fail"
        )
    db.session.delete(file)
    db.session.commit()
    os.remove(os.path.join(current_app.config["UPLOAD_FOLDER"], uuid))
    return dict(status="success", message=" File deleted successfully.")
