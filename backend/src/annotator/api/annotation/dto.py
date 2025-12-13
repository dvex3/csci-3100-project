from flask_restx import Model, fields
from flask_restx.reqparse import RequestParser
from werkzeug.datastructures import FileStorage


annotation_generator_parser = RequestParser(bundle_errors=True)
annotation_generator_parser.add_argument(
    name="function_name", type=str, location="form", required=True, nullable=False
)
annotation_generator_parser.add_argument(
    name="file_uuid", type=str, location="form", required=True, nullable=False
)


annotation_getter = RequestParser(bundle_errors=True)
annotation_getter.add_argument(
    name="file_uuid", type=str, location="form", required=True, nullable=False
)


annotation_info_model = Model(
    "AnnotationInfoResponse",
    {
        "uuid": fields.String,
        "annotation": fields.String,
        "function_name": fields.String,
        "created_at": fields.String,
        "file_id": fields.String,
        "owner_id": fields.String,
    },
)

annotation_info_list_model = Model(
    "AnnotationInfoListResponse",
    {
        "info": fields.List(fields.Nested(annotation_info_model)),
    },
)
