"""
models.py
---------
This module defines the SQLAlchemy database models for the Student Management System.
"""

from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy instance to be bound to Flask app
db = SQLAlchemy()

class Student(db.Model):
    """
    Student model representing the 'students' table in database.
    """
    __tablename__ = 'students'

    # Auto-incrementing primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # Student full name
    name = db.Column(db.String(100), nullable=False)

    # Department name (e.g., Computer Science, Mechanical, Electronics, etc.)
    department = db.Column(db.String(100), nullable=False)

    # Academic year (e.g., 1, 2, 3, 4)
    year = db.Column(db.Integer, nullable=False)

    # Marks obtained (e.g., 85.50)
    marks = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<Student id={self.id} name='{self.name}' department='{self.department}'>"

    def to_dict(self):
        """Helper method to convert student model instance to a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'department': self.department,
            'year': self.year,
            'marks': self.marks
        }
