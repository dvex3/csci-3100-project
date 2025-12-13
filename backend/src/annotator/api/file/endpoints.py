"""API endpoint definitions for /file namespace."""

from http import HTTPStatus

from flask_restx import Namespace, Resource

from annotator.api.file.business import (
    process_file_upload,
    get_file_info,
    get_file_content,
    delete_file,
)
from annotator.api.file.dto import (
    file_upload_parser,
    file_info_model,
    file_info_list_model,
    file_content_model,
)

file_ns = Namespace(name="file", validate=True)
file_ns.models[file_info_model.name] = file_info_model
file_ns.models[file_info_list_model.name] = file_info_list_model
file_ns.models[file_content_model.name] = file_content_model


@file_ns.route("/upload", endpoint="file_upload")
@file_ns.response(int(HTTPStatus.UNAUTHORIZED), "Token is invalid or expired.")
@file_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
@file_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
class UploadFile(Resource):
    """Handles HTTP requests to URL: /api/v1/file/upload"""

    @file_ns.doc(security="Bearer")
    @file_ns.expect(file_upload_parser)
    @file_ns.response(int(HTTPStatus.CREATED), "File was successfully created.")
    @file_ns.marshal_with(file_info_model)
    def post(self):
        """Upload a file to the server."""
        request_data = file_upload_parser.parse_args()
        name = request_data["name"]
        uploaded_file = request_data["file"]
        return process_file_upload(name, uploaded_file)

    @file_ns.doc(security="Bearer")
    @file_ns.marshal_with(file_info_list_model)
    @file_ns.response(int(HTTPStatus.OK), "File info successfully retrieved.")
    def get(self):
        """Retrieve info of all files from a user."""
        return get_file_info()


@file_ns.route("/<file_uuid>", endpoint="file_action")
@file_ns.param("file_uuid", "File UUID.")
@file_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
@file_ns.response(int(HTTPStatus.NOT_FOUND), "File not found.")
@file_ns.response(int(HTTPStatus.UNAUTHORIZED), "Token is invalid or expired.")
@file_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
class FileAction(Resource):
    """Handles HTTP requests to URL: /api/v1/file/{uuid}."""

    @file_ns.doc(security="Bearer")
    @file_ns.marshal_with(file_content_model)
    @file_ns.response(int(HTTPStatus.OK), "File content successfully retrieved.")
    def get(self, file_uuid):
        """Retrieve content of a file"""
        return get_file_content(file_uuid)

    @file_ns.doc(security="Bearer")
    @file_ns.response(int(HTTPStatus.OK), "File deleted successfully.")
    def delete(self, file_uuid):
        """Delete a file"""
        return delete_file(file_uuid)
