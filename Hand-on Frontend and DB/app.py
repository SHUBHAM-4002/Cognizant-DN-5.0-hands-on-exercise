"""
app.py
------
Main application module for the Mini Student Management System.
Handles Flask initialization, route handlers for CRUD operations,
database configuration, input validation, and flash notifications.
"""

import os
from flask import Flask, render_template, request, redirect, url_for, flash
from models import db, Student

def create_app():
    """Factory function to configure and instantiate the Flask application."""
    app = Flask(__name__)

    # Secret key for session management and flash messages
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'student_management_secret_key_12345')

    # Database Configuration:
    # Uses MySQL by default or falls back to local SQLite if MySQL isn't available or configured.
    mysql_uri = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:password@localhost/student_db')
    sqlite_fallback_uri = f"sqlite:///{os.path.join(app.root_path, 'student_db.db')}"

    # Prefer SQLite if DATABASE_URL isn't explicitly defined in environment to ensure instant out-of-the-box local execution
    use_sqlite = os.environ.get('USE_SQLITE', 'true').lower() == 'true'
    
    if use_sqlite:
        app.config['SQLALCHEMY_DATABASE_URI'] = sqlite_fallback_uri
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = mysql_uri

    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Bind SQLAlchemy database instance to app
    db.init_app(app)

    # Initialize database tables & seed initial demo data if database is empty
    with app.app_context():
        db.create_all()
        seed_initial_data()

    return app


def seed_initial_data():
    """Populates the database with sample student records if empty."""
    if Student.query.count() == 0:
        sample_students = [
            Student(name="Aarav Sharma", department="Computer Science", year=3, marks=92.5),
            Student(name="Priya Patel", department="Electronics & Comm", year=2, marks=88.0),
            Student(name="Rohan Verma", department="Mechanical Engineering", year=4, marks=79.5),
            Student(name="Ananya Gupta", department="Information Technology", year=1, marks=95.0),
            Student(name="Vikram Singh", department="Civil Engineering", year=3, marks=84.0)
        ]
        db.session.bulk_save_objects(sample_students)
        db.session.commit()


app = create_app()

# ==========================================
# ROUTES
# ==========================================

@app.route('/')
def home():
    """
    Home Page Route.
    Displays project overview, call-to-action buttons, and basic statistics.
    """
    total_students = Student.query.count()
    avg_marks = 0
    if total_students > 0:
        total_marks = sum(student.marks for student in Student.query.all())
        avg_marks = round(total_marks / total_students, 1)

    return render_template('index.html', total_students=total_students, avg_marks=avg_marks)


@app.route('/students')
def student_list():
    """
    Student List Route.
    Displays all students in a table with support for searching by student name.
    """
    search_query = request.args.get('search', '').strip()

    if search_query:
        # Perform case-insensitive search by student name
        students = Student.query.filter(Student.name.ilike(f"%{search_query}%")).all()
    else:
        # Retrieve all student records ordered by ID ascending
        students = Student.query.order_by(Student.id.asc()).all()

    return render_template('students.html', students=students, search_query=search_query)


@app.route('/students/add', methods=['GET', 'POST'])
def add_student():
    """
    Add Student Route.
    GET: Displays the add student form.
    POST: Validates and saves new student details into database.
    """
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        department = request.form.get('department', '').strip()
        year_raw = request.form.get('year', '').strip()
        marks_raw = request.form.get('marks', '').strip()

        # Input Validation
        errors = []
        if not name:
            errors.append("Student Name is required.")
        if not department:
            errors.append("Department is required.")
        
        try:
            year = int(year_raw)
            if year < 1 or year > 6:
                errors.append("Academic Year must be between 1 and 6.")
        except (ValueError, TypeError):
            errors.append("Please enter a valid integer for Year.")

        try:
            marks = float(marks_raw)
            if marks < 0 or marks > 100:
                errors.append("Marks must be between 0 and 100.")
        except (ValueError, TypeError):
            errors.append("Please enter valid numerical Marks.")

        # Handle validation errors
        if errors:
            for error in errors:
                flash(error, 'danger')
            # Render form again with filled values for convenient correction
            return render_template('add_student.html', 
                                   name=name, 
                                   department=department, 
                                   year=year_raw, 
                                   marks=marks_raw)

        # Save to database
        try:
            new_student = Student(name=name, department=department, year=year, marks=marks)
            db.session.add(new_student)
            db.session.commit()
            flash(f"Student '{name}' added successfully!", 'success')
            return redirect(url_for('student_list'))
        except Exception as e:
            db.session.rollback()
            flash(f"An error occurred while saving student: {str(e)}", 'danger')

    return render_template('add_student.html')


@app.route('/students/edit/<int:id>', methods=['GET', 'POST'])
def edit_student(id):
    """
    Edit Student Route.
    GET: Pre-fills and displays student edit form.
    POST: Validates and updates existing student details in database.
    """
    student = Student.query.get_or_404(id)

    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        department = request.form.get('department', '').strip()
        year_raw = request.form.get('year', '').strip()
        marks_raw = request.form.get('marks', '').strip()

        # Input Validation
        errors = []
        if not name:
            errors.append("Student Name is required.")
        if not department:
            errors.append("Department is required.")
        
        try:
            year = int(year_raw)
            if year < 1 or year > 6:
                errors.append("Academic Year must be between 1 and 6.")
        except (ValueError, TypeError):
            errors.append("Please enter a valid integer for Year.")

        try:
            marks = float(marks_raw)
            if marks < 0 or marks > 100:
                errors.append("Marks must be between 0 and 100.")
        except (ValueError, TypeError):
            errors.append("Please enter valid numerical Marks.")

        # Handle validation errors
        if errors:
            for error in errors:
                flash(error, 'danger')
            return render_template('edit_student.html', student=student)

        # Update database record
        try:
            student.name = name
            student.department = department
            student.year = year
            student.marks = marks
            db.session.commit()
            flash(f"Student '{name}' details updated successfully!", 'success')
            return redirect(url_for('student_list'))
        except Exception as e:
            db.session.rollback()
            flash(f"An error occurred while updating student: {str(e)}", 'danger')

    return render_template('edit_student.html', student=student)


@app.route('/students/delete/<int:id>', methods=['POST'])
def delete_student(id):
    """
    Delete Student Route.
    Deletes the student with specified ID from database.
    """
    student = Student.query.get_or_404(id)
    student_name = student.name
    try:
        db.session.delete(student)
        db.session.commit()
        flash(f"Student '{student_name}' removed successfully.", 'info')
    except Exception as e:
        db.session.rollback()
        flash(f"Failed to delete student: {str(e)}", 'danger')

    return redirect(url_for('student_list'))


@app.errorhandler(404)
def page_not_found(e):
    """Custom 404 handler for non-existent routes."""
    return render_template('index.html', error="Page not found"), 404


if __name__ == '__main__':
    # Run development server on port 5000
    app.run(host='127.0.0.1', port=5000, debug=True)
