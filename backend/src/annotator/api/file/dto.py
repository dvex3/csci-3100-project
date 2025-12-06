"""Parsers and serializers for /file API endpoints."""

from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser
from werkzeug.datastructures import FileStorage


file_upload_parser = RequestParser(bundle_errors=True)
file_upload_parser.add_argument(
    name="name", type=str, location="form", required=True, nullable=False
)
file_upload_parser.add_argument(
    name="file", type=FileStorage, location="files", required=True, nullable=False
)


file_info_model = Model(
    "FileInfoResponse",
    {
        "uuid": fields.String,
        "item_name": fields.String,
        "file_name": fields.String,
        "created_at": fields.String,
        "owner_id": fields.String,
        "parsed_map": fields.String,
    },
)


file_info_list_model = Model(
    "FileInfoListResponse",
    {
        "info": fields.List(fields.Nested(file_info_model)),
    },
)


file_content_model = Model(
    "FileContentModel",
    {
        "content": fields.String,
    },
)
