-- =========================================
-- HANDS-ON 3 : TASK 1
-- SUBQUERIES
-- Student Management System
-- =========================================

-- Q21: Students scoring above the average marks

SELECT *
FROM students
WHERE marks >
(
    SELECT AVG(marks)
    FROM students
);

-- =========================================

-- Q22: Student(s) with the highest marks

SELECT *
FROM students
WHERE marks =
(
    SELECT MAX(marks)
    FROM students
);

-- =========================================

-- Q23: Student(s) with the lowest marks

SELECT *
FROM students
WHERE marks =
(
    SELECT MIN(marks)
    FROM students
);

-- =========================================

-- Q24: Departments having more students than the average department size

SELECT department,
COUNT(*) AS total_students
FROM students
GROUP BY department
HAVING COUNT(*) >
(
    SELECT AVG(student_count)
    FROM
    (
        SELECT COUNT(*) AS student_count
        FROM students
        GROUP BY department
    ) AS dept_avg
);

-- =========================================

-- Q25: Students whose marks are above the department average

SELECT *
FROM students s
WHERE marks >
(
    SELECT AVG(marks)
    FROM students
    WHERE department = s.department
);

-- =========================================
-- HANDS-ON 3 : TASK 2
-- CREATING AND USING VIEWS
-- =========================================

-- Q26: Create Student Summary View

CREATE OR REPLACE VIEW vw_student_summary AS

SELECT
student_id,
first_name,
last_name,
department,
year_of_study,
marks
FROM students;

-- Verify View

SELECT *
FROM vw_student_summary;

-- =========================================

-- Q27: Create Department Statistics View

CREATE OR REPLACE VIEW vw_department_statistics AS

SELECT
department,
COUNT(*) AS total_students,
ROUND(AVG(marks),2) AS average_marks,
MAX(marks) AS highest_marks,
MIN(marks) AS lowest_marks

FROM students

GROUP BY department;

-- Verify View

SELECT *
FROM vw_department_statistics;

-- =========================================

-- Q28: Students scoring above 90 using View

SELECT *
FROM vw_student_summary
WHERE marks > 90;

-- =========================================

-- Q29: Update Student Marks through View

UPDATE vw_student_summary

SET marks = 95

WHERE student_id = 1;

-- Verify

SELECT *
FROM vw_student_summary;

-- =========================================

-- Q30: Delete Student through View

DELETE FROM vw_student_summary

WHERE student_id = 10;

-- Verify

SELECT *
FROM vw_student_summary;

-- =========================================

-- Q31: Drop View

DROP VIEW IF EXISTS vw_department_statistics;

-- =========================================

-- Q32: Recreate View

CREATE VIEW vw_department_statistics AS

SELECT
department,
COUNT(*) AS total_students,
ROUND(AVG(marks),2) AS average_marks

FROM students

GROUP BY department;

-- Verify

SELECT *
FROM vw_department_statistics;

-- =========================================
-- DOCUMENTATION
-- =========================================

-- Subqueries allow one query to be nested inside another query.
-- They are useful for finding students above average marks,
-- highest scorers, lowest scorers, and department-wise analysis.

-- Views are virtual tables created from SQL queries.
-- They simplify complex queries and improve readability.
-- Simple views based on a single table can generally be updated.
-- Aggregate views (GROUP BY, COUNT, AVG, MAX, MIN) are read-only.

-- =========================================
-- END OF HANDS-ON 3
-- =========================================