from datetime import datetime
import hashlib
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)

    
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password_hash = self._hash_password(password)
        self.created_at = datetime.now()
        self.last_login = None
        self.is_active = True

    def _hash_password(self, password):
        """Hash the password using SHA-256."""
        return hashlib.sha256(password.encode()).hexdigest()

    def verify_password(self, password):
        """Verify if the provided password matches the stored hash."""
        return self._hash_password(password) == self.password_hash

    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login = datetime.now()

    def deactivate_account(self):
        """Deactivate the user account."""
        self.is_active = False

    def update_email(self, new_email):
        """Update the user's email address."""
        self.email = new_email

    def to_dict(self):
        """Convert user object to dictionary representation."""
        return {
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'is_active': self.is_active
        }

    def __str__(self):
        return f"User(username={self.username}, email={self.email})"
    
