"""API endpoint definitions for /file namespace."""

from http import HTTPStatus

from flask_restx import Namespace, Resource

from annotator.api.file.business import process_file_upload
from annotator.api.file.dto import file_upload_parser

file_ns = Namespace(name="file", validate=True)


@file_ns.route("/upload", endpoint="file_upload")
class UploadFile(Resource):
    """Handles HTTP requests to URL: /api/v1/file/upload."""

    @file_ns.doc(security="Bearer")
    @file_ns.expect(file_upload_parser)
    @file_ns.response(int(HTTPStatus.CREATED), "File was successfully created.")
    @file_ns.response(int(HTTPStatus.UNAUTHORIZED), "Token is invalid or expired.")
    @file_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @file_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    def post(self):
        """Upload a file to the server."""
        request_data = file_upload_parser.parse_args()
        name = request_data["name"]
        uploaded_file = request_data["file"]
        return process_file_upload(name, uploaded_file)
