-- =========================================
-- HANDS-ON 4 : TASK 1
-- BASELINE PERFORMANCE (NO INDEXES)
-- Student Management System
-- =========================================

-- Q33
-- Observe the execution plan before creating indexes

EXPLAIN

SELECT *
FROM students
WHERE department = 'CSE';

-- =========================================

-- Q34
-- Observe execution plan for searching by email

EXPLAIN

SELECT *
FROM students
WHERE email = 'rahul@gmail.com';

-- =========================================

-- Q35
-- Observe execution plan for marks filtering

EXPLAIN

SELECT *
FROM students
WHERE marks > 85;

-- =========================================
-- TASK 2 : CREATE INDEXES
-- =========================================

-- Q36
-- Create index on Department

CREATE INDEX idx_students_department
ON students(department);

-- =========================================

-- Q37
-- Create Unique Index on Email

CREATE UNIQUE INDEX idx_students_email
ON students(email);

-- =========================================

-- Q38
-- Create Index on Marks

CREATE INDEX idx_students_marks
ON students(marks);

-- =========================================

-- Q39
-- Compare execution plan after indexing

EXPLAIN

SELECT *
FROM students
WHERE department='CSE';

-- =========================================

-- Q40
-- Compare execution plan for Email Search

EXPLAIN

SELECT *
FROM students
WHERE email='rahul@gmail.com';

-- =========================================

-- Q41
-- Compare execution plan for Marks Search

EXPLAIN

SELECT *
FROM students
WHERE marks>85;

-- =========================================
-- TASK 3 : QUERY OPTIMIZATION
-- =========================================

-- Q42
-- Search Students by Department

SELECT *
FROM students
WHERE department='ECE';

-- =========================================

-- Q43
-- Search Students by Email

SELECT *
FROM students
WHERE email='yash@gmail.com';

-- =========================================

-- Q44
-- Display Top 5 Students

SELECT *
FROM students
ORDER BY marks DESC
LIMIT 5;

-- =========================================

-- Q45
-- Count Students Department-wise

SELECT
department,
COUNT(*) AS total_students

FROM students

GROUP BY department;

-- =========================================
-- TASK 4 : PERFORMANCE DOCUMENTATION
-- =========================================

-- Q46
-- Why are Indexes Important?
--
-- Indexes improve query performance by reducing
-- the number of rows scanned.
--
-- Without an index:
-- PostgreSQL performs a Sequential Scan.
--
-- With an index:
-- PostgreSQL performs an Index Scan,
-- resulting in faster search operations.

-- =========================================

-- Q47
-- Example Comparison
--
-- Without Index
-- Search Time  : Slow
-- Scan Type    : Sequential Scan
--
-- With Index
-- Search Time  : Faster
-- Scan Type    : Index Scan

-- =========================================

-- Q48
-- Best Practices
--
-- • Create indexes on frequently searched columns.
-- • Avoid creating too many indexes because they
--   slow INSERT, UPDATE, and DELETE operations.
-- • Use UNIQUE indexes for unique fields such as Email.
-- • Analyze query performance using EXPLAIN.

-- =========================================
-- END OF HANDS-ON 4
-- =========================================