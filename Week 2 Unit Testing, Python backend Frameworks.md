# Python FSE - Week 2 Detailed Study Guide (CTS Digital Nurture 5.0)

## Week 2 Topics

* Advanced Unit Testing
* Python Backend Frameworks

  * Django
  * Flask
  * FastAPI

---

# 1. Advanced Unit Testing

## What is Unit Testing?

Unit Testing is the process of testing individual components or functions of an application to ensure they work correctly.

### Advantages

* Detects bugs early
* Improves code quality
* Simplifies debugging
* Makes code easier to maintain
* Supports Continuous Integration (CI)

---

## unittest Framework

Python's built-in testing framework.

### Example

```python
import unittest

def multiply(a, b):
    return a * b

class TestMath(unittest.TestCase):

    def test_multiply(self):
        self.assertEqual(multiply(2, 5), 10)

if __name__ == "__main__":
    unittest.main()
```

---

## PyTest Framework

A popular third-party testing framework with simple syntax.

### Example

```python
def divide(a, b):
    return a / b

def test_divide():
    assert divide(10, 2) == 5
```

### Run Test

```bash
pytest
```

---

## Mocking

Mocking replaces real objects with fake objects during testing.

### Example

```python
from unittest.mock import Mock

api = Mock()

api.get_data.return_value = "Success"

print(api.get_data())
```

### Output

```text
Success
```

---

## Test Coverage

Test Coverage measures how much of the source code is tested.

### Run Coverage

```bash
coverage run -m pytest
coverage report
```

---

## Interview Questions

### Oral

* What is Unit Testing?
* Difference between unittest and pytest?
* What is Mocking?
* What is Test Coverage?
* Why is testing important?

### Coding

* Write test cases for a Calculator.
* Test a Login Function.
* Mock an API response.

---

# 2. Django Framework

## What is Django?

Django is a high-level Python web framework used to build secure and scalable web applications.

### Features

* Fast Development
* Built-in Authentication
* ORM (Object Relational Mapping)
* Secure by Default
* Scalable

---

## Django Architecture

```text
User
 ↓
URL
 ↓
View
 ↓
Model
 ↓
Database
```

---

## Install Django

```bash
pip install django
```

---

## Create Project

```bash
django-admin startproject myproject
```

---

## Create Application

```bash
python manage.py startapp myapp
```

---

## Run Server

```bash
python manage.py runserver
```

---

## Django URL Example

```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home),
]
```

---

## Django View Example

```python
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello Django")
```

---

## Advantages

* Rapid Development
* Secure
* Built-in Admin Panel
* ORM Support
* Authentication System

---

## Applications

* Instagram
* Pinterest
* Mozilla
* Disqus

---

# 3. Flask Framework

## What is Flask?

Flask is a lightweight Python web framework.

### Features

* Minimal
* Flexible
* Easy to Learn
* REST API Friendly

---

## Install Flask

```bash
pip install flask
```

---

## Flask Example

```python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello Flask"

app.run()
```

---

## Advantages

* Lightweight
* Fast Development
* Easy Routing
* Suitable for APIs

---

## Applications

* REST APIs
* Small Projects
* Microservices

---

# 4. FastAPI Framework

## What is FastAPI?

FastAPI is a modern Python framework for building high-performance REST APIs.

### Features

* Very Fast
* Automatic API Documentation
* Async Support
* Type Validation

---

## Install FastAPI

```bash
pip install fastapi uvicorn
```

---

## FastAPI Example

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message":"Hello FastAPI"}
```

---

## Run Server

```bash
uvicorn main:app --reload
```

---

## Swagger Documentation

Visit:

```text
http://127.0.0.1:8000/docs
```

---

## Advantages

* High Performance
* Automatic Validation
* Easy API Development
* Interactive Documentation

---

# Django vs Flask vs FastAPI

| Feature     | Django     | Flask           | FastAPI       |
| ----------- | ---------- | --------------- | ------------- |
| Type        | Full Stack | Micro Framework | API Framework |
| Speed       | Medium     | Fast            | Very Fast     |
| Learning    | Moderate   | Easy            | Easy          |
| REST API    | Yes        | Yes             | Excellent     |
| ORM         | Built-in   | Extension       | SQLAlchemy    |
| Admin Panel | Yes        | No              | No            |

---

# REST API Basics

## What is REST API?

REST (Representational State Transfer) is a method for communication between client and server using HTTP.

---

## HTTP Methods

| Method | Purpose               |
| ------ | --------------------- |
| GET    | Retrieve Data         |
| POST   | Create Data           |
| PUT    | Update Entire Record  |
| PATCH  | Update Partial Record |
| DELETE | Delete Data           |

---

## JSON Example

```json
{
    "id":1,
    "name":"John"
}
```

---

# Learning Outcome

After completing Week 2, I gained knowledge in:

* Advanced Unit Testing
* Mocking and Test Coverage
* Django Framework
* Flask Framework
* FastAPI Framework
* REST API Development
* HTTP Methods
* JSON Handling
* Backend Application Development

---

## Author

**Name:** SHUBHAM KUMAR
**Program:** Cognizant Digital Nurture 5.0
**Track:** Python Full Stack Engineer (Python FSE)
**Week:** 2
