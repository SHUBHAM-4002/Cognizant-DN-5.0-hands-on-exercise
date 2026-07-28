# Mini Student Management System

A beginner-friendly full-stack web application built using **Python, Flask, HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, and MySQL / SQLAlchemy ORM**. 

The application demonstrates core **CRUD** (Create, Read, Update, Delete) operations and database connectivity, featuring a clean white and blue modern UI.

---

## 🚀 Features

- **Home Dashboard**: Displays overall statistics (total students count, average marks) and quick access cards.
- **View All Students**: Interactive table listing student records with department badges, academic year, and marks.
- **Search Students**: Search student records by student name in real-time.
- **Add Student**: Form to register new student records with client-side and server-side validation.
- **Edit Student**: Pre-filled form to update existing student information.
- **Delete Student**: Delete student records with confirmation prompts.
- **Flash Notifications**: Instant visual feedback alerts upon adding, updating, or deleting records.
- **Responsive Blue & White Theme**: Styled using Bootstrap 5 and custom CSS with smooth hover animations.

---

## 🛠️ Technologies & Concepts Used

### 1. Programming Languages & Core Stack
- **Python 3**: Written for server-side logic, routing, input validation, and database operations in `app.py`.
- **HTML5**: Page structure and semantic layout across all Jinja templates.
- **CSS3**: Custom blue & white design system, card shadow elevations, and table hover effects in `static/css/style.css`.
- **Vanilla JavaScript (ES6)**: Form client-side validation, auto-dismissing flash alerts, and deletion confirmation dialogs in `static/js/script.js`.

### 2. Backend Framework & Extensions
- **Flask**: Web framework handling routing, request parsing, session flash messages (`flash`), and rendering templates (`render_template`).
- **Flask-SQLAlchemy**: SQLAlchemy extension providing high-level ORM database queries, session handling, and model creation.
- **PyMySQL**: Python driver enabling direct connection to MySQL database instances.

### 3. Database & Storage Layer
- **SQLAlchemy ORM**: Used in `models.py` to map Python classes to SQL database tables (`Student`).
- **MySQL / SQLite Dual Driver Support**:
  - Configured for **MySQL** (`mysql+pymysql://root:password@localhost/student_db`).
  - Automatic fallback to local **SQLite** (`sqlite:///student_db.db`) for out-of-the-box zero-configuration local execution.

### 4. Frontend UI Frameworks & UI Libraries
- **Bootstrap 5**: Responsive grid layout, card components, form controls, badges, and utility classes.
- **Bootstrap Icons**: Vector icon set (`bi-mortarboard`, `bi-people`, `bi-pencil-square`, `bi-trash`).
- **Google Fonts (Inter)**: Clean typography.

### 5. Architecture & Key Software Design Concepts
- **MVC (Model-View-Controller) Architecture**:
  - **Model**: `models.py` (Database entity schemas)
  - **View**: `templates/` (HTML templates with Jinja2 syntax)
  - **Controller**: `app.py` (Request handling and business logic)
- **CRUD Pattern**:
  - **C**reate: Add student records (`/students/add`)
  - **R**ead: View all records & search by name (`/students`)
  - **U**pdate: Pre-fill & update student records (`/students/edit/<id>`)
  - **D**elete: Delete student records (`/students/delete/<id>`)
- **Dual-Layer Form Validation**: Both client-side JavaScript checks and server-side Python checks to guarantee data integrity.
- **Jinja2 Templating**: Template inheritance (`base.html`), dynamic block rendering, logic loops, and conditionals.

---

## 📁 Project Structure & File Roles

```
student-management/
│
├── app.py                  # Main Flask server, routes, and CRUD business logic
├── models.py               # SQLAlchemy ORM model definition (Student model)
├── requirements.txt        # Python package dependencies
├── templates/              # Jinja2 HTML templates
│   ├── base.html           # Master layout with navigation bar and alerts
│   ├── index.html          # Home page with quick cards and statistics
│   ├── students.html       # Student list table with search bar
│   ├── add_student.html    # Form to add a new student
│   └── edit_student.html   # Form to edit existing student details
│
├── static/                 # Static assets
│   ├── css/
│   │   └── style.css       # Custom blue & white styling and animations
│   └── js/
│       └── script.js       # Client-side form validation & delete confirmation
│
└── README.md               # Project documentation and setup instructions
```

---

## 💻 Local Setup Instructions

### Prerequisites
Make sure you have installed:
- [Python 3.8+](https://www.python.org/downloads/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) *(Optional - fallback to SQLite is built-in)*

---

### Step 1: Open Project Directory
Navigate into the `student-management` project directory:
```bash
cd student-management
```

---

### Step 2: Create & Activate Virtual Environment (Optional but Recommended)

**On Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate
```

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

---

### Step 3: Install Dependencies
Install the required packages using `requirements.txt`:
```bash
pip install -r requirements.txt
```

---

### Step 4: Database Setup

#### Option A: Running with MySQL (Default Schema)
1. Open your MySQL client or Workbench and create the database:
```sql
CREATE DATABASE student_db;
```

2. Set environment variables for your MySQL connection string or update `app.py`:
```powershell
# Windows PowerShell
$env:USE_SQLITE="false"
$env:DATABASE_URL="mysql+pymysql://root:yourpassword@localhost/student_db"
```
```bash
# macOS / Linux
export USE_SQLITE="false"
export DATABASE_URL="mysql+pymysql://root:yourpassword@localhost/student_db"
```

#### Option B: Running with SQLite (Out-of-the-Box Default)
No setup required! By default, if MySQL is not configured, the application automatically initializes a local SQLite database (`student_db.db`) pre-populated with sample demo records.

---

### Step 5: Run the Application
Start the Flask development server:
```bash
python app.py
```

Open your web browser and navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 📊 Database Schema

**Table Name**: `students`

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment | Unique Student ID |
| `name` | String(100) | NOT NULL | Full Name of Student |
| `department` | String(100) | NOT NULL | Academic Department |
| `year` | Integer | NOT NULL | Academic Year (1, 2, 3, 4) |
| `marks` | Float | NOT NULL | Marks obtained (0.0 - 100.0) |

---

## 📝 License
This project is open-source and intended for learning full-stack Python development.
