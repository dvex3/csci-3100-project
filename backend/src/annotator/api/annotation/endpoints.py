"""API endpoint definitions for /annotation namespace."""

from flask_restx import Namespace, Resource

from annotator.api.annotation.business import (
    get_annotation,
    annotate,
)

from annotator.api.annotation.dto import (
    annotation_generator,
    annotation_getter,
)


annotation_ns = Namespace(name="annotation", validate=True)

@annotation_ns.route("/generate", endpoint="annotation_generate")
class Annotate(Resource):
    """Handles HTTP requests to URL: /api/v1/annotation/generate"""

    @annotation_ns.expect(annotation_getter)
    @annotation_ns.doc(security="Bearer")
    def get(self):
        """Retrieve message history"""
        request_data = annotation_getter.parse_args()
        file_uuid = request_data["file_uuid"]
        return get_annotation(file_uuid)

    @annotation_ns.expect( annotation_generator)
    @annotation_ns.doc(security="Bearer")
    def post(self):
        """Upload generated chat message to db"""
        request_data = annotation_generator.parse_args()
        file_uuid = request_data["file_uuid"]
        function_name = request_data["function_name"]
        return annotate(file_uuid, function_name)

    # @annotation_ns.doc(security="Bearer")
    # def post(self):
    #     """Upload generated chat message to db"""
    #     return annotate()

