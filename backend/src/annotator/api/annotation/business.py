"""Business logic for /annotation API endpoints."""

import os
from uuid import uuid4

from flask import current_app, jsonify

from annotator import db
from annotator.api.auth.decorators import token_required
from annotator.models.file import File
from annotator.models.annotation import Annotation

from annotator.api.annotation.util import chat


@token_required
def get_annotation(file_uuid):
    annotation_list_raw = Annotation.find_by_file_id(file_uuid)
    print(annotation_list_raw)
    annotation_list_processed = []
    for element in annotation_list_raw:
        annotation_list_processed.append(element.as_dict())
    return dict(
        info=annotation_list_processed,
    )


@token_required
def get_parsed_map(file_uuid):
    file = File.find_by_uuid(file_uuid)
    parsed_map = file.parsed_map
    return parsed_map


@token_required
def get_owner_id(file_uuid):
    file = File.find_by_uuid(file_uuid)
    owner_id = file.owner_id
    return owner_id


@token_required
def annotate(file_uuid, function_name="hello_world"):
    owner_id = get_owner_id(file_uuid)
    parsed_map = get_parsed_map(file_uuid)
    annotation = chat(function_name, parsed_map)
    uuid = str(uuid4())
    new_annotation = Annotation(
        uuid=uuid,
        annotation=annotation,
        function_name=function_name,
        file_id=file_uuid,
        owner_id=owner_id,
    )
    db.session.add(new_annotation)
    db.session.commit()
    return Annotation.find_by_uuid(uuid).as_dict()
