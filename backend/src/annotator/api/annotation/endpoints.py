"""API endpoint definitions for /annotation namespace."""

from flask_restx import Namespace, Resource

from annotator.api.annotation.business import (
    get_annotation,
    annotate,
)



annotation_ns = Namespace(name="annotation", validate=True)

@annotation_ns.route("/generate", endpoint="annotation_generate")
class Annotate(Resource):
    """Handles HTTP requests to URL: /api/v1/annotation/generate"""

    @annotation_ns.doc(security="Bearer")
    def get(self, file_uuid):
        """Retrieve message history"""

        return get_annotation(file_uuid)


    @annotation_ns.doc(security="Bearer")
    def post(self, file_uuid, function_name):
        """Upload generated chat message to db"""
        return annotate(file_uuid, function_name)

    # @annotation_ns.doc(security="Bearer")
    # def post(self):
    #     """Upload generated chat message to db"""
    #     return annotate()

