"""Parsers and serializers for /file API endpoints."""

from flask_restx.reqparse import RequestParser
from werkzeug.datastructures import FileStorage


file_upload_parser = RequestParser(bundle_errors=True)
file_upload_parser.add_argument(
    name="name", type=str, location="form", required=True, nullable=False
)
file_upload_parser.add_argument(
    name="file", type=FileStorage, location="files", required=True, nullable=False
)
