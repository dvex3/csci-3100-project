"""Class definition for File model."""

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


class File(db.Model):
    """File model for storing user-uploaded files."""

    __tablename__ = "site_file"

    uuid = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    item_name = db.Column(db.String(100), nullable=False)
    file_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=utc_now)
    owner_id = db.Column(
        db.String(36), db.ForeignKey("site_user.public_id"), nullable=False
    )
    owner = db.relationship("User", backref="files")
    parsed_map = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<file_name={self.file_name}, item_name={self.item_name}>"

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

    def as_dict(self):
        output = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        output["created_at"] = localized_dt_string(self.created_at)
        return output
