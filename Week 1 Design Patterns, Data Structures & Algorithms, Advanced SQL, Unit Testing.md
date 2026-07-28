# Python FSE - Week 1 Detailed Study Guide (CTS Digital Nurture 5.0)

## Week 1 Topics

* Design Patterns and Principles
* Data Structures and Algorithms (DSA)
* Advanced SQL
* Unit Testing (PyTest, unittest)
* Jest & Mocha Basics

---

# 1. Design Patterns and Principles

## What are Design Patterns?

Design Patterns are reusable solutions to common software design problems.

### Benefits

* Reusable Code
* Better Maintainability
* Scalability
* Easy Debugging
* Improved Software Architecture

---

## SOLID Principles

### S - Single Responsibility Principle (SRP)

A class should have only one reason to change.

### Bad Example

```python
class Employee:
    def calculate_salary(self):
        pass

    def save_to_database(self):
        pass
```

### Good Example

```python
class Employee:
    def calculate_salary(self):
        pass

class EmployeeDB:
    def save(self):
        pass
```

### Interview Question

**Q:** What is SRP?

**Answer:** A class should perform only one responsibility and have only one reason to change.

---

### O - Open Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

```python
class Discount:
    def apply(self):
        pass

class FestivalDiscount(Discount):
    def apply(self):
        return "20%"
```

### Interview Question

**Q:** Explain Open Closed Principle.

**Answer:** Existing code should not be modified while adding new functionality.

---

### L - Liskov Substitution Principle (LSP)

Child classes should be replaceable with parent classes without changing program behavior.

```python
class Bird:
    def fly(self):
        pass

class Sparrow(Bird):
    pass
```

---

### I - Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they do not use.

---

### D - Dependency Inversion Principle (DIP)

Depend on abstractions, not concrete implementations.

```python
class Keyboard:
    pass

class Computer:
    def __init__(self, keyboard):
        self.keyboard = keyboard
```

---

## Singleton Design Pattern

Ensures that only one object of a class exists.

### Example

```python
class Singleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

a = Singleton()
b = Singleton()

print(a == b)
```

### Output

```text
True
```

### Real-Time Uses

* Database Connections
* Logger Objects
* Configuration Managers

---

## Factory Design Pattern

Creates objects without exposing object creation logic.

```python
class Car:
    pass

class Bike:
    pass

class VehicleFactory:
    def create_vehicle(self, vehicle):
        if vehicle == "car":
            return Car()
        return Bike()
```

### Interview Questions

#### Oral

* What is SOLID?
* What is a Design Pattern?
* Singleton vs Factory Pattern?
* Advantages of Design Patterns?
* Real-time use of Singleton?

#### Coding

* Create a Singleton Class.
* Implement Factory Pattern.

---

# 2. Data Structures and Algorithms

## Time Complexity

Measures algorithm efficiency.

| Complexity | Meaning            |
| ---------- | ------------------ |
| O(1)       | Constant           |
| O(log n)   | Logarithmic        |
| O(n)       | Linear             |
| O(n log n) | Linear Logarithmic |
| O(n²)      | Quadratic          |

---

## Array (List)

```python
arr = [10, 20, 30]
```

### Operations

```python
arr.append(40)
arr.pop()
```

---

## Stack

### LIFO (Last In First Out)

```python
stack = []

stack.append(10)
stack.append(20)

print(stack.pop())
```

### Output

```text
20
```

### Applications

* Undo Operation
* Browser History
* Function Call Stack

---

## Queue

### FIFO (First In First Out)

```python
from collections import deque

q = deque()

q.append(10)
q.append(20)

print(q.popleft())
```

### Output

```text
10
```

### Applications

* CPU Scheduling
* Task Processing
* Printer Queue

---

## Linked List

Node-based data structure.

```python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
```

---

## Binary Search

### Algorithm

1. Find middle element.
2. Compare with target.
3. Search left or right half.
4. Repeat until found.

### Pseudocode

```text
start = 0
end = n - 1

while start <= end

    mid = (start + end) // 2

    if arr[mid] == target
        return mid

    if arr[mid] < target
        start = mid + 1

    else
        end = mid - 1
```

### Python Code

```python
def binary_search(arr, target):
    l, r = 0, len(arr) - 1

    while l <= r:
        m = (l + r) // 2

        if arr[m] == target:
            return m

        elif arr[m] < target:
            l = m + 1

        else:
            r = m - 1

    return -1
```

### Complexity

```text
O(log n)
```

---

## Bubble Sort

### Algorithm

1. Compare adjacent elements.
2. Swap if larger.
3. Repeat until sorted.

### Code

```python
arr = [5, 3, 1, 4]

for i in range(len(arr)):
    for j in range(len(arr) - 1):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]

print(arr)
```

### Output

```text
[1, 3, 4, 5]
```

---

## Interview Questions

### Oral

* Difference between Array and Linked List?
* Stack vs Queue?
* What is Recursion?
* Explain Big-O Notation.
* What is Binary Search?

### Coding

* Reverse String
* Palindrome Check
* Implement Stack
* Binary Search
* Sort Array
* Find Duplicates
* Fibonacci Series
* Prime Number
* Two Sum Problem
* Linked List Insertion

---

# 3. Advanced SQL

## DDL Commands

### CREATE

```sql
CREATE TABLE Employee(
    id INT,
    name VARCHAR(50)
);
```

### ALTER

```sql
ALTER TABLE Employee
ADD salary INT;
```

### DROP

```sql
DROP TABLE Employee;
```

---

## DML Commands

### INSERT

```sql
INSERT INTO Employee
VALUES(1,'John');
```

### UPDATE

```sql
UPDATE Employee
SET salary = 50000
WHERE id = 1;
```

### DELETE

```sql
DELETE FROM Employee
WHERE id = 1;
```

---

## JOINS

### INNER JOIN

```sql
SELECT *
FROM Employee e
INNER JOIN Department d
ON e.deptid = d.id;
```

### LEFT JOIN

```sql
SELECT *
FROM Employee e
LEFT JOIN Department d
ON e.deptid = d.id;
```

---

## GROUP BY

```sql
SELECT deptid,
COUNT(*)
FROM Employee
GROUP BY deptid;
```

---

## HAVING

```sql
SELECT deptid,
COUNT(*)
FROM Employee
GROUP BY deptid
HAVING COUNT(*) > 2;
```

---

## Window Function - ROW_NUMBER()

```sql
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY deptid
ORDER BY salary DESC
)
FROM Employee;
```

---

## SQL Interview Questions

### Oral

* Difference between WHERE and HAVING?
* Primary Key vs Foreign Key?
* What are Joins?
* Explain Normalization.
* Clustered vs Non-Clustered Index?

### SQL Coding

* Second Highest Salary
* Nth Highest Salary
* Duplicate Records
* Delete Duplicates
* Employees Above Average Salary
* Top 3 Salaries Department Wise
* Employees Without Department
* Rank Salaries

---

# 4. Unit Testing (PyTest & unittest)

## Why Testing?

Testing ensures that applications work correctly and helps identify bugs early.

---

## unittest Example

```python
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):

    def test_add(self):
        self.assertEqual(add(2, 3), 5)

if __name__ == "__main__":
    unittest.main()
```

---

## PyTest Example

```python
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
```

### Run

```bash
pytest
```

---

## Interview Questions

* What is Unit Testing?
* PyTest vs unittest?
* Assertions?
* Mocking?
* Test Coverage?

---

# 5. Jest & Mocha Basics

## Jest Example

```javascript
function add(a,b){
    return a+b;
}

test("addition",()=>{
    expect(add(2,3)).toBe(5);
});
```

---

## Mocha Example

```javascript
const assert = require("assert");

describe("Add", function(){

    it("should add", function(){

        assert.equal(2+3, 5);

    });

});
```

---

# Most Important CTS DN 5.0 Coding Questions

## Easy

* Palindrome
* Fibonacci
* Prime Number
* Armstrong Number
* Reverse String
* Reverse Number
* Factorial
* Anagram

## Medium

* Binary Search
* Two Sum
* Missing Number
* Merge Sorted Arrays
* Duplicate Elements
* Longest Common Prefix
* Valid Parentheses
* Matrix Rotation

## SQL

* Second Highest Salary
* Nth Highest Salary
* Employee Manager Query
* Joins
* Group By
* Window Functions
* CTE
* Stored Procedure

---

# Learning Outcome

After completing Week 1, I gained knowledge in:

* Design Patterns and SOLID Principles
* Data Structures and Algorithms
* Time Complexity Analysis
* Searching and Sorting Algorithms
* Advanced SQL Concepts
* Unit Testing using unittest and PyTest
* Basics of Jest and Mocha
* CTS Technical Interview Preparation

---

### Author

**Name:** SHUBHAM KUMAR
**Program:** Cognizant Digital Nurture 5.0
**Track:** Python Full Stack Engineer (Python FSE)
**Week:** 1
