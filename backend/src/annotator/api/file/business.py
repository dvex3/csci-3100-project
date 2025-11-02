"""Business logic for /file API endpoints."""

import os
from uuid import uuid4

from flask import current_app
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
    new_file = File(
        uuid=uuid,
        item_name=item_name,
        file_name=file_name,
        owner_id=owner_id,
        owner=owner,
    )
    db.session.add(new_file)
    db.session.commit()
    file = File.find_by_uuid(uuid)
    return dict(
        uuid=file.uuid,
        created_at=localized_dt_string(file.created_at),
        item_name=item_name,
        file_name=file_name,
        owner_id=owner_id,
    )
