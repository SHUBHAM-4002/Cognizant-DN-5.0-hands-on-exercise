# Python FSE – Week 6 Study Guide

---

# Introduction to Advanced Selenium

Advanced Selenium Automation involves building scalable, maintainable, and reusable automation frameworks for testing web applications. It includes framework design, cross-browser testing, reporting, and data-driven testing.

---

# Selenium Automation Framework

A Selenium Framework is a structured collection of guidelines and reusable components that help automate testing efficiently.

## Advantages

- Reusable Code
- Easy Maintenance
- Better Readability
- Faster Test Execution
- Scalable Test Automation
- Easy Debugging

---

# Types of Selenium Frameworks

### 1. Data-Driven Framework

Test data is stored separately from the test scripts.

Example:

```
Test Script

↓

Excel / CSV / JSON

↓

Execute Test
```

Advantages

- Easy to update test data
- Supports multiple test cases
- Less code duplication

---

### 2. Keyword-Driven Framework

Testing is performed using predefined keywords.

Example Keywords

- Click
- Open Browser
- Enter Text
- Verify Title
- Close Browser

Advantages

- Easy for non-programmers
- High reusability
- Easy maintenance

---

### 3. Hybrid Framework

Combination of

- Data-Driven
- Keyword-Driven
- Page Object Model

Most companies prefer Hybrid Frameworks.

---

# Selenium Grid

## What is Selenium Grid?

Selenium Grid allows executing test cases on multiple browsers and operating systems simultaneously.

Example

```
Tester

↓

Selenium Grid Hub

↓

Chrome

↓

Firefox

↓

Edge
```

Advantages

- Parallel Execution
- Saves Time
- Supports Multiple Browsers
- Supports Multiple Operating Systems

---

# Cross Browser Testing

Cross Browser Testing ensures the application behaves correctly across different browsers.

Supported Browsers

- Chrome
- Firefox
- Edge
- Safari
- Opera

Benefits

- Better User Experience
- Browser Compatibility
- Improved Quality

---

# Parallel Testing

Multiple test cases are executed simultaneously.

Example

```
Test 1 → Chrome

Test 2 → Firefox

Test 3 → Edge

↓

Execute Together
```

Advantages

- Faster execution
- Saves testing time
- Improves productivity

---

# Page Object Model (POM)

## What is POM?

Page Object Model is a design pattern where each webpage is represented as a separate Python class.

Advantages

- Reusable Code
- Easy Maintenance
- Better Readability
- Reduced Code Duplication

---

## POM Folder Structure

```
Project

│

├── pages

│      login.py

│      home.py

│

├── tests

│      test_login.py

│

├── utilities

│

└── reports
```

---

# Sample Login Page Class

```python
from selenium.webdriver.common.by import By

class LoginPage:

    username = (By.ID, "username")
    password = (By.ID, "password")
    login = (By.ID, "login")

    def __init__(self, driver):
        self.driver = driver

    def login_app(self, user, pwd):
        self.driver.find_element(*self.username).send_keys(user)
        self.driver.find_element(*self.password).send_keys(pwd)
        self.driver.find_element(*self.login).click()
```

---

# Data Driven Testing

Data Driven Testing runs the same test with different input values.

Example

```python
import pytest

@pytest.mark.parametrize("username,password",[
("admin","1234"),
("user","abcd"),
("guest","guest")
])

def test_login(username,password):

    print(username,password)
```

---

# Test Reports

Automation reports provide execution details.

Common Report Types

- HTML Report
- Allure Report
- Extent Report

Generate HTML Report

```bash
pytest --html=report.html
```

Benefits

- Easy analysis
- Failure details
- Execution summary

---

# Logging

Logging records application execution details.

Example

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.info("Browser Launched Successfully")
```

Advantages

- Debugging
- Trace execution
- Error analysis

---

# Screenshot Capture

Capture screenshots during failures.

```python
driver.save_screenshot("failed_test.png")
```

Benefits

- Helps debugging
- Evidence for failed tests

---

# Selenium Best Practices

- Use Explicit Wait instead of time.sleep()
- Follow Page Object Model
- Keep scripts modular
- Use reusable methods
- Handle exceptions properly
- Generate reports
- Capture screenshots on failures
- Use meaningful variable names

---

# Common Selenium Exceptions

- NoSuchElementException
- TimeoutException
- InvalidSelectorException
- StaleElementReferenceException
- NoAlertPresentException
- ElementClickInterceptedException

---

# Selenium Automation Workflow

```
Requirement

↓

Design Test Cases

↓

Create Automation Script

↓

Execute Test Cases

↓

Generate Report

↓

Fix Defects

↓

Retest

↓

Deployment
```

---

# Advantages of Selenium Framework

- High Reusability
- Faster Automation
- Reduced Maintenance
- Better Organization
- Easy Team Collaboration
- Supports Large Projects

---

# Limitations

- Cannot automate desktop applications
- Cannot bypass CAPTCHA
- Requires browser drivers
- Limited mobile testing support

---

# Popular Automation Tools

- Selenium
- Playwright
- Cypress
- Appium
- Robot Framework
- TestNG
- PyTest
- JUnit

---

# Learning Outcomes

- Selenium Automation Framework
- Data Driven Testing
- Keyword Driven Testing
- Hybrid Framework
- Selenium Grid
- Parallel Testing
- Cross Browser Testing
- Page Object Model (POM)
- Test Reports
- Logging
- Screenshot Capture
- Selenium Best Practices
- Selenium Exceptions
- Advanced Selenium Interview Preparation

---
 
# Python FSE – Week 6 Study Guide

---

# Introduction to Git

Git is a **Distributed Version Control System (DVCS)** used to track changes in source code during software development. It helps developers collaborate efficiently and maintain project history.

---

# Why Git?

Git is used to:

- Track code changes
- Collaborate with developers
- Restore previous versions
- Manage multiple project versions
- Maintain project history
- Support Continuous Integration (CI)

---

# Features of Git

- Open Source
- Distributed Version Control
- Fast Performance
- Branching Support
- Merging
- Security
- Easy Collaboration

---

# What is Version Control?

Version Control is a system that records changes made to files over time.

### Advantages

- Backup of source code
- Easy collaboration
- Recover deleted code
- Track project history
- Manage different versions

---

# Types of Version Control

## 1. Local Version Control

Stores project versions on a local computer.

Example

```
Developer

↓

Local Repository
```

---

## 2. Centralized Version Control

One central server stores all project files.

Examples

- SVN
- CVS

---

## 3. Distributed Version Control

Every developer has a complete copy of the repository.

Examples

- Git
- Mercurial

---

# Git Architecture

```
Working Directory

↓

Staging Area

↓

Local Repository

↓

Remote Repository (GitHub)
```

---

# Git Workflow

```
Create Project

↓

Modify Files

↓

git add

↓

git commit

↓

git push

↓

GitHub Repository
```

---

# Git Installation

Download Git

https://git-scm.com

Check Version

```bash
git --version
```

---

# Git Configuration

Configure Username

```bash
git config --global user.name "Yashvanth"
```

Configure Email

```bash
git config --global user.email "example@gmail.com"
```

View Configuration

```bash
git config --list
```

---

# Creating a Repository

Initialize Git

```bash
git init
```

Output

```
Initialized empty Git repository
```

---

# Git Status

Check current repository status.

```bash
git status
```

---

# Adding Files

Add one file

```bash
git add file.py
```

Add all files

```bash
git add .
```

---

# Commit Changes

Save project changes.

```bash
git commit -m "Initial Commit"
```

---

# View Commit History

```bash
git log
```

Short Version

```bash
git log --oneline
```

---

# Connect to GitHub

Add Remote Repository

```bash
git remote add origin https://github.com/username/project.git
```

Check Remote

```bash
git remote -v
```

---

# Push Code

First Push

```bash
git push -u origin main
```

Next Push

```bash
git push
```

---

# Clone Repository

Download an existing repository.

```bash
git clone https://github.com/username/project.git
```

---

# Pull Latest Changes

```bash
git pull origin main
```

---

# Fetch Changes

```bash
git fetch
```

Difference

- **git pull** = Fetch + Merge
- **git fetch** = Downloads changes only

---

# Git Branch

Create Branch

```bash
git branch feature
```

View Branches

```bash
git branch
```

Switch Branch

```bash
git checkout feature
```

Create and Switch

```bash
git checkout -b feature
```

---

# Merge Branch

```bash
git checkout main

git merge feature
```

---

# Delete Branch

```bash
git branch -d feature
```

---

# Git Stash

Temporarily save uncommitted changes.

Save

```bash
git stash
```

View

```bash
git stash list
```

Restore

```bash
git stash pop
```

---

# Git Tag

Create Version Tag

```bash
git tag v1.0
```

View Tags

```bash
git tag
```

---

# Undo Changes

Discard Changes

```bash
git restore file.py
```

Undo Last Commit

```bash
git reset HEAD~1
```

---

# GitHub

GitHub is a cloud-based platform used to host Git repositories and collaborate on software projects.

---

# GitHub Features

- Repository Hosting
- Pull Requests
- Code Review
- Issues
- Actions
- Wiki
- Project Boards

---

# Repository

A Repository (Repo) stores project files and their version history.

Types

- Public Repository
- Private Repository

---

# Fork

Fork creates your own copy of another repository.

```
Original Repository

↓

Fork

↓

Your GitHub Account
```

---

# Pull Request (PR)

A Pull Request requests the repository owner to merge your code changes.

Workflow

```
Fork

↓

Create Branch

↓

Commit Changes

↓

Push Code

↓

Create Pull Request

↓

Review

↓

Merge
```

---

# Merge Conflict

Occurs when two developers modify the same part of a file.

Solution

- Pull latest code
- Resolve conflicts
- Commit changes
- Push again

---

# .gitignore

Used to ignore unnecessary files.

Example

```
__pycache__/

*.pyc

.env

venv/
```

---

# Common Git Commands

| Command | Description |
|----------|-------------|
| git init | Initialize repository |
| git status | Repository status |
| git add . | Stage all files |
| git commit | Save changes |
| git push | Upload code |
| git pull | Download latest changes |
| git clone | Copy repository |
| git branch | List branches |
| git checkout | Switch branch |
| git merge | Merge branch |
| git stash | Save temporary changes |
| git log | Commit history |

---

# Best Practices

- Commit frequently.
- Write meaningful commit messages.
- Pull before pushing.
- Use branches for new features.
- Keep repositories organized.
- Use `.gitignore`.
- Review code before merging.

---

# Advantages of Git

- Easy Collaboration
- Backup
- Version Tracking
- Fast Performance
- Distributed Architecture
- Branching Support
- Easy Recovery

---

# Learning Outcomes


- Git Fundamentals
- Version Control Concepts
- Git Architecture
- Git Workflow
- Git Installation
- Git Configuration
- Repository Management
- Branching and Merging
- GitHub Basics
- Pull Requests
- Merge Conflicts
- .gitignore
- Git Best Practices

---

# Python FSE – Week 6 Study Guide

---

# Introduction to CI/CD

CI/CD stands for **Continuous Integration** and **Continuous Delivery/Continuous Deployment**.

It is a DevOps practice that automates the process of building, testing, and deploying software applications.

CI/CD helps teams deliver software faster, more reliably, and with fewer errors.

---

# What is Continuous Integration (CI)?

Continuous Integration is the practice of automatically integrating code changes from multiple developers into a shared repository several times a day.

Every code change is automatically:

- Built
- Tested
- Verified

before being merged into the main branch.

---

# Benefits of Continuous Integration

- Early Bug Detection
- Better Code Quality
- Faster Development
- Automatic Testing
- Easy Collaboration
- Reduced Integration Problems

---

# What is Continuous Delivery (CD)?

Continuous Delivery ensures that software is always ready for deployment.

After passing all automated tests, the application is prepared for release, but deployment requires manual approval.

---

# What is Continuous Deployment?

Continuous Deployment automatically deploys the application after all tests pass without manual intervention.

---

# Difference Between CI, Continuous Delivery and Continuous Deployment

| Feature | Continuous Integration | Continuous Delivery | Continuous Deployment |
|----------|------------------------|---------------------|-----------------------|
| Code Build | Yes | Yes | Yes |
| Automated Testing | Yes | Yes | Yes |
| Ready for Release | No | Yes | Yes |
| Automatic Deployment | No | No | Yes |
| Manual Approval | Not Required | Required | Not Required |

---

# CI/CD Pipeline

A CI/CD pipeline automates software delivery.

```
Developer

↓

Git Commit

↓

Build

↓

Automated Testing

↓

Package

↓

Deploy

↓

Production
```

---

# CI/CD Workflow

```
Write Code

↓

Commit Code

↓

Push to GitHub

↓

CI Server Detects Changes

↓

Build Project

↓

Run Test Cases

↓

Generate Reports

↓

Deploy Application
```

---

# Why Use CI/CD?

- Faster Releases
- Automated Testing
- Improved Software Quality
- Reduced Manual Work
- Faster Bug Detection
- Continuous Monitoring

---

# Popular CI/CD Tools

- Jenkins
- GitHub Actions
- GitLab CI/CD
- CircleCI
- Travis CI
- Azure DevOps
- Bamboo
- TeamCity

---

# Jenkins

## What is Jenkins?

Jenkins is an open-source automation server used for building, testing, and deploying software.

It is one of the most popular CI/CD tools.

---

# Features of Jenkins

- Open Source
- Easy Integration
- Plugin Support
- Automated Builds
- Distributed Builds
- Easy Configuration

---

# Jenkins Architecture

```
Developer

↓

GitHub

↓

Jenkins Server

↓

Build

↓

Testing

↓

Deployment
```

---

# Jenkins Pipeline Stages

```
Source Code

↓

Build

↓

Test

↓

Package

↓

Deploy
```

---

# GitHub Actions

GitHub Actions is GitHub's built-in CI/CD platform.

It automatically runs workflows whenever code is pushed to GitHub.

---

# GitHub Actions Workflow

```
Developer Pushes Code

↓

GitHub Repository

↓

GitHub Action Triggered

↓

Build

↓

Testing

↓

Deployment
```

---

# Workflow File

GitHub Actions workflows are stored inside

```
.github/workflows/
```

Example

```yaml
name: Python CI

on:
  push:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    steps:

      - uses: actions/checkout@v3

      - name: Setup Python

        uses: actions/setup-python@v4

        with:
          python-version: "3.11"

      - name: Install Dependencies

        run: pip install -r requirements.txt

      - name: Run Tests

        run: pytest
```

---

# Build

Build converts source code into an executable application.

Examples

- Python Package
- Java JAR
- Docker Image

---

# Automated Testing

Automated tests execute automatically after every code change.

Examples

- Unit Testing
- Integration Testing
- Selenium Automation
- API Testing

---

# Deployment

Deployment releases the application to a server.

Types

- Development
- Testing
- Staging
- Production

---

# Continuous Monitoring

Monitoring ensures applications are running correctly after deployment.

Popular Tools

- Prometheus
- Grafana
- ELK Stack
- Splunk

---

# CI/CD Best Practices

- Commit small changes frequently.
- Automate testing.
- Keep builds fast.
- Use version control.
- Monitor deployments.
- Use separate environments.
- Secure sensitive credentials.
- Review code before merging.

---

# Advantages of CI/CD

- Faster Software Delivery
- Better Collaboration
- Improved Code Quality
- Reduced Deployment Risk
- Early Bug Detection
- Higher Productivity
- Reliable Releases

---

# Challenges

- Initial Setup
- Learning Curve
- Infrastructure Cost
- Pipeline Maintenance
- Tool Configuration

---

# CI/CD in Python Projects

Typical workflow

```
Write Python Code

↓

Git Commit

↓

GitHub Push

↓

GitHub Actions

↓

Run PyTest

↓

Generate Reports

↓

Deploy FastAPI/Django Application
```

---

# Real-World Example

Suppose a developer fixes a bug in a FastAPI application.

Workflow

1. Modify Code
2. Commit Changes
3. Push to GitHub
4. GitHub Actions Starts
5. Install Dependencies
6. Execute PyTest
7. Build Application
8. Deploy Successfully

No manual testing or deployment is required.

---

# Common CI/CD Terms

| Term | Meaning |
|------|----------|
| Build | Compile or package application |
| Pipeline | Automated workflow |
| Artifact | Build output |
| Deployment | Release application |
| Rollback | Return to previous version |
| Trigger | Starts pipeline automatically |

---

# Learning Outcomes

After completing this part, I learned:

- Continuous Integration (CI)
- Continuous Delivery (CD)
- Continuous Deployment
- CI/CD Pipeline
- Jenkins Basics
- GitHub Actions
- Build Automation
- Deployment Process
- Automated Testing
- Monitoring
- CI/CD Best Practices

---

# Python FSE – Week 6 Study Guide

---

# Introduction to DevOps

DevOps is a combination of **Development (Dev)** and **Operations (Ops)**. It is a software development methodology that improves collaboration between developers and operations teams to deliver software faster and more reliably.

---

# What is DevOps?

DevOps is a culture, set of practices, and collection of tools that automate software development, testing, deployment, and monitoring.

### Goals of DevOps

- Faster Software Delivery
- Better Collaboration
- Continuous Integration
- Continuous Deployment
- Improved Software Quality
- Reduced Manual Work

---

# Why DevOps?

Traditional software development had several challenges:

- Slow software delivery
- Communication gap between teams
- Manual deployments
- Frequent production issues
- Long testing cycles

DevOps solves these problems by introducing automation and collaboration.

---

# Traditional SDLC vs DevOps

| Traditional SDLC | DevOps |
|------------------|---------|
| Separate Teams | Collaborative Teams |
| Manual Deployment | Automated Deployment |
| Slow Releases | Fast Releases |
| Less Automation | High Automation |
| Long Feedback Cycle | Continuous Feedback |

---

# DevOps Lifecycle

```
Planning

↓

Development

↓

Build

↓

Testing

↓

Release

↓

Deployment

↓

Operations

↓

Monitoring

↓

Planning
```

The lifecycle repeats continuously to improve software quality.

---

# DevOps Phases

## 1. Planning

Project requirements are collected and analyzed.

Examples

- Requirement Analysis
- User Stories
- Sprint Planning

---

## 2. Development

Developers write application code.

Common Languages

- Python
- Java
- JavaScript
- C#

---

## 3. Build

Source code is compiled and packaged.

Popular Build Tools

- Maven
- Gradle
- Ant
- npm

---

## 4. Testing

Automated tests are executed to verify software quality.

Types

- Unit Testing
- Integration Testing
- Functional Testing
- Selenium Testing

---

## 5. Release

Application is prepared for deployment.

Activities

- Versioning
- Documentation
- Approval

---

## 6. Deployment

Application is deployed to servers.

Deployment Types

- Development
- Testing
- Staging
- Production

---

## 7. Operations

Operations team ensures the application runs smoothly.

Responsibilities

- Server Management
- Performance Monitoring
- Security
- Backup

---

## 8. Monitoring

Application performance is continuously monitored.

Popular Tools

- Grafana
- Prometheus
- ELK Stack
- Splunk

---

# DevOps Architecture

```
Developer

↓

Git Repository

↓

CI Server

↓

Build

↓

Testing

↓

Deployment

↓

Production Server

↓

Monitoring
```

---

# DevOps Tools

| Category | Tool |
|----------|------|
| Version Control | Git |
| Repository | GitHub |
| Build Tool | Maven |
| CI/CD | Jenkins |
| Testing | Selenium |
| Container | Docker |
| Orchestration | Kubernetes |
| Monitoring | Grafana |
| Cloud | AWS |

---

# Infrastructure as Code (IaC)

Infrastructure as Code means managing servers and infrastructure using code instead of manual configuration.

Advantages

- Automation
- Faster Deployment
- Consistency
- Easy Maintenance

Popular IaC Tools

- Terraform
- Ansible
- Puppet
- Chef

---

# Automation

Automation is one of the core principles of DevOps.

Automated Tasks

- Build
- Testing
- Deployment
- Monitoring
- Backup

Benefits

- Saves Time
- Reduces Errors
- Improves Productivity

---

# Agile vs DevOps

| Agile | DevOps |
|--------|---------|
| Focus on Development | Focus on Development & Operations |
| Faster Coding | Faster Delivery |
| Sprint Based | Continuous Process |
| Team Collaboration | Cross-Team Collaboration |

---

# Continuous Feedback

DevOps encourages continuous feedback from:

- Customers
- Testers
- Developers
- Monitoring Tools

This helps improve software continuously.

---

# Monitoring

Monitoring tracks application performance after deployment.

Examples

- CPU Usage
- Memory Usage
- Response Time
- Error Rate
- Server Health

---

# Logging

Logging records application events.

Benefits

- Debugging
- Error Analysis
- Performance Tracking
- Security Auditing

Example

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.info("Application Started")
```

---

# Benefits of DevOps

- Faster Releases
- Better Collaboration
- Reduced Costs
- Improved Quality
- Faster Bug Fixes
- High Availability
- Continuous Monitoring
- Better Customer Satisfaction

---

# Challenges in DevOps

- Learning New Tools
- Initial Setup Cost
- Security Management
- Infrastructure Maintenance
- Continuous Monitoring

---

# Real-World DevOps Workflow

```
Developer Writes Code

↓

Git Commit

↓

GitHub Repository

↓

Jenkins Build

↓

Run PyTest

↓

Run Selenium Tests

↓

Docker Build

↓

Deploy Application

↓

Monitor Production
```

---

# Best Practices

- Automate repetitive tasks.
- Use Version Control.
- Write automated tests.
- Monitor applications continuously.
- Keep deployments small and frequent.
- Use Infrastructure as Code.
- Follow CI/CD practices.
- Maintain proper documentation.

---

# Popular DevOps Platforms

- GitHub
- GitLab
- Azure DevOps
- AWS DevOps
- Google Cloud DevOps
- Red Hat OpenShift

---

# Learning Outcomes

- DevOps Fundamentals
- DevOps Lifecycle
- Agile vs DevOps
- CI/CD Concepts
- Infrastructure as Code
- Automation
- Monitoring
- Logging
- DevOps Tools
- DevOps Workflow
- Best Practices

---
