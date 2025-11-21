from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser
from werkzeug.datastructures import FileStorage


annotation_generator = RequestParser(bundle_errors=True)
annotation_generator.add_argument(
    name="function_name", type=str, location="form", required=True, nullable=False
)
annotation_generator.add_argument(
    name="file_uuid", type=str, location="form", required=True, nullable=False
)



annotation_getter = RequestParser(bundle_errors=True)
annotation_getter.add_argument(
    name="file_uuid", type=str, location="form", required=True, nullable=False
)


