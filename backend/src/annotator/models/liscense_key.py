"""Class definition for LicenseKey model."""

from annotator import db

import random
import string


class LicenseKey(db.Model):
    """LicenseKey model for storing license keys for user registration."""

    __tablename__ = "site_license_key"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(255), unique=True, nullable=False)
    used = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return "<LicenseKey key=%r>" % self.key

    def __init__(self, key):
        self.key = key
        self.used = False

    @classmethod
    def find_by_license_key(cls, key):
        return cls.query.filter_by(key=key).first()

    @staticmethod
    def generate_license_key():
        key = ""
        key += "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
        for i in range(3):
            key += "-"
            key += "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
        return key
