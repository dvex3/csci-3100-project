"""Business logic for /annotation API endpoints."""

import json
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
    parsed_map = json.loads(file.parsed_map)
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

    start_line = 0
    end_line = 0
    for function in parsed_map["functions"]:
        if function["name"] == function_name:
            start_line = function["start_line"]
            end_line = function["end_line"]

    code = ""
    file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], file_uuid)
    with open(file_path, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i > end_line - 1:
                break
            if i >= start_line - 1:
                code += line

    annotation = chat(function_name, parsed_map, code)
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
