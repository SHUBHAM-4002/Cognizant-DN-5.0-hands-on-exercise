-- =========================================
-- Student Management System
-- Database Design & Core SQL
-- =========================================

-- Login to PostgreSQL
-- psql -U postgres

-- =========================================
-- STEP 1 : CREATE DATABASE
-- =========================================

CREATE DATABASE student_management_db;

-- Connect to Database
-- \c student_management_db

-- =========================================
-- TABLE 1 : students
-- =========================================

CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    department VARCHAR(100) NOT NULL,
    year_of_study INT NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    marks DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verify Table

\d students


-- =========================================
-- TASK 1
-- INSERT SAMPLE RECORDS
-- =========================================

INSERT INTO students
(first_name,last_name,gender,department,year_of_study,email,phone,marks)
VALUES
('Yash','SR','Male','ECE',4,'yash@gmail.com','9876543210',91.5),
('Rahul','Kumar','Male','CSE',3,'rahul@gmail.com','9876501234',82.0),
('Priya','Sharma','Female','IT',2,'priya@gmail.com','9876504321',95.0),
('Anjali','R','Female','ECE',1,'anjali@gmail.com','9876549876',88.4),
('Karthik','S','Male','AIDS',4,'karthik@gmail.com','9999988888',79.2);


-- View Records

SELECT * FROM students;


-- =========================================
-- TASK 2
-- BASIC SQL QUERIES
-- =========================================

-- View all students

SELECT * FROM students;

-- View only names

SELECT first_name,last_name
FROM students;

-- View students from ECE

SELECT *
FROM students
WHERE department='ECE';

-- View students scoring above 85

SELECT *
FROM students
WHERE marks>85;

-- Sort by Marks

SELECT *
FROM students
ORDER BY marks DESC;

-- Count Students

SELECT COUNT(*)
FROM students;

-- Average Marks

SELECT AVG(marks)
FROM students;

-- Highest Marks

SELECT MAX(marks)
FROM students;

-- Lowest Marks

SELECT MIN(marks)
FROM students;


-- =========================================
-- TASK 3
-- UPDATE OPERATIONS
-- =========================================

-- Update Marks

UPDATE students
SET marks=93
WHERE student_id=1;

-- Update Department

UPDATE students
SET department='AI & DS'
WHERE student_id=5;

-- Verify

SELECT * FROM students;


-- =========================================
-- TASK 4
-- DELETE OPERATIONS
-- =========================================

-- Delete Student

DELETE FROM students
WHERE student_id=2;

-- Verify

SELECT * FROM students;


-- =========================================
-- TASK 5
-- ALTER TABLE OPERATIONS
-- =========================================

-- Add Attendance Column

ALTER TABLE students
ADD COLUMN attendance DECIMAL(5,2);

-- Verify

\d students

-- Rename Column

ALTER TABLE students
RENAME COLUMN phone TO mobile_number;

-- Verify

\d students

-- Add CHECK Constraint

ALTER TABLE students
ADD CONSTRAINT chk_marks
CHECK(marks>=0 AND marks<=100);

-- Verify

\d students

-- Drop Attendance Column

ALTER TABLE students
DROP COLUMN attendance;

-- Verify

\d students


-- =========================================
-- TASK 6
-- SEARCH OPERATIONS
-- =========================================

-- Search by Name

SELECT *
FROM students
WHERE first_name ILIKE '%ya%';

-- Search by Department

SELECT *
FROM students
WHERE department='ECE';

-- Search by Year

SELECT *
FROM students
WHERE year_of_study=4;


-- =========================================
-- TASK 7
-- AGGREGATE FUNCTIONS
-- =========================================

-- Total Students

SELECT COUNT(*) AS Total_Students
FROM students;

-- Average Marks

SELECT AVG(marks) AS Average_Marks
FROM students;

-- Highest Marks

SELECT MAX(marks) AS Highest_Marks
FROM students;

-- Lowest Marks

SELECT MIN(marks) AS Lowest_Marks
FROM students;


-- =========================================
-- TASK 8
-- NORMALIZATION ANALYSIS
-- =========================================

-- First Normal Form (1NF)
-- All attributes contain atomic values.
-- Each student has one email and one phone number.
-- No repeating groups exist.

-- Second Normal Form (2NF)
-- The table has a single-column primary key.
-- Every non-key attribute depends on student_id.

-- Third Normal Form (3NF)
-- No transitive dependency exists.
-- Student details depend only on student_id.
-- Department names are stored directly because this is a
-- mini project. In larger applications, departments should
-- be moved into a separate Departments table.

-- =========================================
-- TASK 9
-- DROP TABLE
-- =========================================

DROP TABLE students;

-- =========================================
-- END OF MINI PROJECT
-- =========================================