-- =========================================
-- HANDS-ON 2 : TASK 1
-- INSERT, UPDATE AND DELETE OPERATIONS
-- Student Management System
-- =========================================

-- =========================================
-- INSERT SAMPLE DATA
-- =========================================

INSERT INTO students
(first_name,last_name,gender,department,year_of_study,email,phone,marks)
VALUES
('Yash','SR','Male','ECE',4,'yash@gmail.com','9876543210',91.5),
('Rahul','Kumar','Male','CSE',3,'rahul@gmail.com','9876501234',82.0),
('Priya','Sharma','Female','IT',2,'priya@gmail.com','9876504321',95.0),
('Anjali','R','Female','ECE',1,'anjali@gmail.com','9876549876',88.4),
('Karthik','S','Male','AI & DS',4,'karthik@gmail.com','9999988888',79.2),
('Deepak','Raj','Male','EEE',2,'deepak@gmail.com','9876512345',74.8),
('Meena','Lakshmi','Female','CSE',3,'meena@gmail.com','9876523456',86.5),
('Arun','Prakash','Male','IT',1,'arun@gmail.com','9876534567',69.5);

-- =========================================
-- ADD 2 CUSTOM STUDENTS
-- =========================================

INSERT INTO students
(first_name,last_name,gender,department,year_of_study,email,phone,marks)
VALUES
('Vignesh','Kumar','Male','ECE',2,'vignesh@gmail.com','9999911111',84.5),
('Nisha','Ravi','Female','CSE',4,'nisha@gmail.com','9999922222',93.8);

-- =========================================
-- UPDATE STUDENT MARKS
-- =========================================

UPDATE students
SET marks = 90
WHERE student_id = 5;

-- =========================================
-- UPDATE DEPARTMENT
-- =========================================

UPDATE students
SET department = 'Artificial Intelligence'
WHERE student_id = 5;

-- =========================================
-- DELETE A STUDENT
-- =========================================

DELETE FROM students
WHERE student_id = 8;

-- =========================================
-- VERIFY RECORD COUNT
-- =========================================

SELECT COUNT(*) AS total_students
FROM students;

-- =========================================
-- TASK 2
-- BASIC SELECT QUERIES
-- =========================================

-- Q1: Display all students

SELECT *
FROM students;

-- Q2: Students from ECE Department

SELECT *
FROM students
WHERE department='ECE';

-- Q3: Students scoring above 85 marks

SELECT *
FROM students
WHERE marks>85;

-- Q4: Students in Final Year

SELECT *
FROM students
WHERE year_of_study=4;

-- Q5: Students ordered by Marks

SELECT *
FROM students
ORDER BY marks DESC;

-- Q6: Students ordered alphabetically

SELECT *
FROM students
ORDER BY first_name ASC;

-- Q7: Students whose email ends with gmail.com

SELECT *
FROM students
WHERE email LIKE '%gmail.com';

-- Q8: Students whose name starts with 'A'

SELECT *
FROM students
WHERE first_name LIKE 'A%';

-- =========================================
-- TASK 3
-- AGGREGATE FUNCTIONS
-- =========================================

-- Q9: Total Students

SELECT COUNT(*) AS total_students
FROM students;

-- Q10: Average Marks

SELECT AVG(marks) AS average_marks
FROM students;

-- Q11: Highest Marks

SELECT MAX(marks) AS highest_marks
FROM students;

-- Q12: Lowest Marks

SELECT MIN(marks) AS lowest_marks
FROM students;

-- Q13: Total Students Department Wise

SELECT department,
COUNT(*) AS total_students
FROM students
GROUP BY department
ORDER BY department;

-- Q14: Average Marks Department Wise

SELECT department,
ROUND(AVG(marks),2) AS average_marks
FROM students
GROUP BY department
ORDER BY average_marks DESC;

-- =========================================
-- TASK 4
-- ADVANCED QUERIES
-- =========================================

-- Q15: Students scoring between 80 and 95

SELECT *
FROM students
WHERE marks BETWEEN 80 AND 95;

-- Q16: Top 5 Students

SELECT *
FROM students
ORDER BY marks DESC
LIMIT 5;

-- Q17: Students with Marks below Average

SELECT *
FROM students
WHERE marks <
(
SELECT AVG(marks)
FROM students
);

-- Q18: Department having more than one student

SELECT department,
COUNT(*) AS total_students
FROM students
GROUP BY department
HAVING COUNT(*) > 1;

-- Q19: Search Student by Name

SELECT *
FROM students
WHERE first_name ILIKE '%ya%';

-- Q20: Search Student by Department

SELECT *
FROM students
WHERE department='CSE';

-- =========================================
-- TASK 5
-- ALTER TABLE OPERATIONS
-- =========================================

-- Add Attendance Column

ALTER TABLE students
ADD COLUMN attendance DECIMAL(5,2);

-- Verify

\d students

-- Rename Phone Column

ALTER TABLE students
RENAME COLUMN phone TO mobile_number;

-- Verify

\d students

-- Add CHECK Constraint

ALTER TABLE students
ADD CONSTRAINT chk_marks
CHECK (marks>=0 AND marks<=100);

-- Verify

\d students

-- Drop Attendance Column

ALTER TABLE students
DROP COLUMN attendance;

-- Verify

\d students;

-- =========================================
-- END OF HANDS-ON 2
-- =========================================