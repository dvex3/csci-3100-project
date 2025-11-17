"""Class definition for Annotation model."""

from datetime import datetime, timezone, timedelta
from uuid import uuid4

from sqlalchemy.ext.hybrid import hybrid_property

from annotator import db
from annotator.util.datetime_util import (
    utc_now,
    make_tzaware,
    localized_dt_string,
    get_local_utcoffset,
)


class Annotation(db.Model):
    """Annotation model for storing chatbot-generated annotations."""

    __tablename__ = "site_annotation"

    uuid = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    annotation = db.Column(db.String(1000), nullable=False)
    function_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)
    file_id = db.Column(db.String(36), db.ForeignKey("site_file.uuid"), nullable=False)
    owner_id = db.Column(
        db.String(36), db.ForeignKey("site_user.public_id"), nullable=False
    )
    owner = db.relationship("User", backref="files")
    file = db.relationship("File", backref="annotations")

    def __repr__(self):
        return f"<annotation = {self.annotation}, file_id={self.file_id}, owner_id={self.owner_id}, uuid={self.uuid}>"

    @hybrid_property
    def created_at_str(self):
        created_at_utc = make_tzaware(
            self.created_at, use_tz=timezone.utc, localize=False
        )
        return localized_dt_string(created_at_utc, use_tz=get_local_utcoffset())

    @classmethod
    def find_by_uuid(cls, uuid):
        return cls.query.filter_by(uuid=uuid).first()

    @classmethod
    def find_by_user_id(cls, user_id):
        return cls.query.filter_by(owner_id=user_id).all()

    @classmethod
    def find_by_file_id(cls, file_id):
        return cls.query.filter_by(file_id=file_id).all()

    def as_dict(self):
        output = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        output["created_at"] = localized_dt_string(self.created_at)
        return output
