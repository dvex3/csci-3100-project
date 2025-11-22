"""API endpoint definitions for /annotation namespace."""

from flask_restx import Namespace, Resource

from annotator.api.annotation.business import (
    get_annotation,
    annotate,
)

from annotator.api.annotation.dto import (
    annotation_generator_parser,
    annotation_info_model,
    annotation_info_list_model,
)

annotation_ns = Namespace(name="annotation", validate=True)
annotation_ns.models[annotation_info_model.name] = annotation_info_model
annotation_ns.models[annotation_info_list_model.name] = annotation_info_list_model


@annotation_ns.route("/generate", endpoint="annotation_generate")
class Annotate(Resource):
    """Handles HTTP requests to URL: /api/v1/annotation/generate"""

    @annotation_ns.expect(annotation_generator_parser)
    @annotation_ns.marshal_with(annotation_info_model)
    @annotation_ns.doc(security="Bearer")
    def post(self):
        """Upload generated chat message to db"""
        request_data = annotation_generator_parser.parse_args()
        file_uuid = request_data["file_uuid"]
        function_name = request_data["function_name"]
        return annotate(file_uuid, function_name)

    # @annotation_ns.doc(security="Bearer")
    # def post(self):
    #     """Upload generated chat message to db"""
    #     return annotate()


@annotation_ns.route("/<file_uuid>", endpoint="annotation_get")
@annotation_ns.param("file_uuid", "File UUID.")
class GetAnnotation(Resource):
    """Handles HTTP requests to URL: /api/v1/annotation/<file_uuid>"""

    @annotation_ns.marshal_with(annotation_info_list_model)
    @annotation_ns.doc(security="Bearer")
    def get(self, file_uuid):
        return get_annotation(file_uuid)
