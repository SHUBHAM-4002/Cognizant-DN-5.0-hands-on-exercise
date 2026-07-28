# Python FSE – Week 5 Study Guide
QA Concepts & Software Testing Fundamentals

---

# What is Software Testing?

Software Testing is the process of verifying and validating a software application to ensure it meets the specified requirements and is free from defects. It helps deliver high-quality, reliable, and secure software.

### Objectives of Software Testing

- Detect bugs and defects
- Ensure software quality
- Verify requirements
- Improve customer satisfaction
- Reduce development cost
- Increase application reliability
- Prevent failures in production

---

# What is Quality Assurance (QA)?

Quality Assurance (QA) is a process-oriented approach that focuses on preventing defects by improving the software development process.

### Responsibilities of QA

- Define testing standards
- Prepare test plans
- Design test cases
- Execute tests
- Report defects
- Ensure quality before release

---

# Quality Assurance (QA) vs Quality Control (QC)

| QA | QC |
|----|----|
| Process Oriented | Product Oriented |
| Prevents defects | Finds defects |
| Proactive | Reactive |
| Focuses on process | Focuses on product |
| Done throughout SDLC | Done during testing phase |

---

# Software Development Life Cycle (SDLC)

SDLC is the complete process of developing software.

### Phases

1. Requirement Analysis
2. Planning
3. System Design
4. Development
5. Testing
6. Deployment
7. Maintenance

---

# Software Testing Life Cycle (STLC)

STLC defines all activities performed during software testing.

### Phases

1. Requirement Analysis
2. Test Planning
3. Test Case Development
4. Environment Setup
5. Test Execution
6. Defect Reporting
7. Test Closure

---

# Testing Principles

### Seven Principles of Testing

- Testing shows the presence of defects, not their absence.
- Exhaustive testing is impossible.
- Start testing early.
- Defects are often clustered.
- Repeated tests become less effective over time.
- Testing depends on context.
- Absence of errors does not guarantee a successful product.

---

# Types of Testing

## Functional Testing

Checks whether the application functions according to requirements.

Examples:

- Login Testing
- Registration Testing
- Payment Testing
- Search Functionality

---

## Non-Functional Testing

Evaluates system performance and usability.

Examples

- Performance Testing
- Load Testing
- Stress Testing
- Security Testing
- Compatibility Testing
- Usability Testing

---

# Levels of Testing

### Unit Testing

Tests individual functions or modules.

Example

```
Testing a login function.
```

---

### Integration Testing

Tests communication between multiple modules.

---

### System Testing

Tests the complete application.

---

### Acceptance Testing

Performed by customers or end users before deployment.

---

# Manual Testing

Manual Testing involves executing test cases manually without using automation tools.

### Advantages

- Easy to start
- Suitable for UI testing
- Human observation
- No programming required

### Disadvantages

- Time-consuming
- Repetitive
- Less efficient for regression testing

---

# Automation Testing

Automation Testing uses tools like Selenium to execute test cases automatically.

### Advantages

- Faster execution
- Reusable scripts
- Higher accuracy
- Suitable for regression testing

### Disadvantages

- Initial setup cost
- Requires programming knowledge
- Maintenance effort

---

# Manual Testing vs Automation Testing

| Manual Testing | Automation Testing |
|----------------|-------------------|
| Human execution | Tool execution |
| Slower | Faster |
| Less accurate | More accurate |
| Suitable for small projects | Suitable for large projects |
| Low setup cost | High initial cost |

---

# Defect (Bug) Life Cycle

```
New

↓

Assigned

↓

Open

↓

Fixed

↓

Retest

↓

Verified

↓

Closed
```

If the defect still exists after fixing:

```
Reopen
```

---

# Severity vs Priority

| Severity | Priority |
|----------|----------|
| Impact of defect | Urgency to fix |
| Decided by Tester | Decided by Business Team |
| Technical | Business |

Example

- Login page not opening → High Severity & High Priority
- Typo in About Page → Low Severity & Low Priority

---

# Test Case

A Test Case is a document that specifies how to verify a particular functionality.

### Basic Test Case Format

| Test Case ID | Description | Expected Result | Actual Result | Status |
|--------------|-------------|-----------------|---------------|--------|
| TC001 | Login with valid credentials | Login Successful | Login Successful | Pass |

---

# Test Plan

A Test Plan defines the overall testing strategy.

It includes:

- Scope
- Objectives
- Resources
- Schedule
- Testing Types
- Risks
- Deliverables

---

# Bug Report

A Bug Report records defects identified during testing.

### Contents

- Bug ID
- Title
- Description
- Steps to Reproduce
- Expected Result
- Actual Result
- Severity
- Priority
- Status

---

# Entry Criteria

Conditions required before testing starts.

Examples

- Requirements approved
- Build available
- Test environment ready

---

# Exit Criteria

Conditions required before testing ends.

Examples

- All critical defects fixed
- Test cases executed
- Test report completed

---

# Test Metrics

Common software testing metrics:

- Test Case Execution Percentage
- Defect Density
- Test Coverage
- Defect Leakage
- Pass Percentage
- Failed Test Cases

---

# Best Practices

- Start testing early.
- Write clear test cases.
- Report defects immediately.
- Prioritize critical test cases.
- Perform regression testing regularly.
- Maintain proper documentation.
- Communicate effectively with developers.

---

# Advantages of Software Testing

- Improves software quality
- Detects defects early
- Reduces maintenance cost
- Increases customer confidence
- Enhances security
- Improves performance

---

# Common Testing Tools

- Selenium
- PyTest
- JUnit
- TestNG
- Postman
- JMeter
- Cypress
- Playwright

---

# Learning Outcomes

- Software Testing Fundamentals
- QA and QC Concepts
- SDLC and STLC
- Testing Principles
- Functional and Non-Functional Testing
- Levels of Testing
- Manual vs Automation Testing
- Defect Life Cycle
- Severity and Priority
- Test Cases and Test Plans
- Bug Reporting
- Testing Metrics
- Software Testing Best Practices

---

# Python FSE – Week 5 Study Guide
Selenium Basics with Python

---

# What is Selenium?

Selenium is an open-source automation testing tool used to automate web browsers. It allows testers to write scripts that perform actions on web applications just like a real user.

### Features

- Open Source
- Supports Multiple Browsers
- Supports Multiple Programming Languages
- Cross-Platform
- Easy Integration with Testing Frameworks

---

# Why Selenium?

- Reduces Manual Testing Effort
- Faster Test Execution
- Reusable Test Scripts
- Supports Continuous Integration
- Suitable for Regression Testing

---

# Selenium Components

### 1. Selenium IDE

- Browser Extension
- Record and Playback
- Beginner Friendly

### 2. Selenium WebDriver

- Automates Browser Actions
- Most Popular Selenium Component

### 3. Selenium Grid

- Executes Tests on Multiple Machines
- Parallel Test Execution

---

# Selenium Architecture

```
Python Script

↓

Selenium WebDriver

↓

Browser Driver

↓

Web Browser

↓

Web Application
```

---

# Installing Selenium

Install Selenium using pip.

```bash
pip install selenium
```

Check Version

```bash
pip show selenium
```

---

# Browser Driver

WebDriver requires a browser driver.

Examples

- ChromeDriver
- GeckoDriver (Firefox)
- EdgeDriver

---

# Launching Chrome Browser

```python
from selenium import webdriver

driver = webdriver.Chrome()

driver.get("https://www.google.com")
```

---

# Closing Browser

```python
driver.close()
```

Close all browser windows

```python
driver.quit()
```

---

# Browser Commands

```python
driver.get("https://example.com")

driver.back()

driver.forward()

driver.refresh()

driver.maximize_window()

driver.minimize_window()
```

---

# Getting Page Information

```python
print(driver.title)

print(driver.current_url)

print(driver.page_source)
```

---

# Locators

Locators help Selenium identify web elements.

Common Locators

- ID
- Name
- Class Name
- Tag Name
- Link Text
- Partial Link Text
- XPath
- CSS Selector

---

# Finding Elements

By ID

```python
from selenium.webdriver.common.by import By

driver.find_element(By.ID,"username")
```

By Name

```python
driver.find_element(By.NAME,"password")
```

By Class Name

```python
driver.find_element(By.CLASS_NAME,"login")
```

---

# XPath

XPath identifies elements using XML path expressions.

Example

```python
driver.find_element(By.XPATH,"//input[@id='username']")
```

---

# CSS Selector

Example

```python
driver.find_element(By.CSS_SELECTOR,"input#username")
```

---

# WebElement Commands

Enter Text

```python
element.send_keys("Admin")
```

Click Button

```python
element.click()
```

Clear Text

```python
element.clear()
```

Submit Form

```python
element.submit()
```

---

# Waits in Selenium

### Implicit Wait

```python
driver.implicitly_wait(10)
```

---

### Explicit Wait

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

WebDriverWait(driver,10).until(
EC.presence_of_element_located((By.ID,"username"))
)
```

---

# Handling Login Example

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver=webdriver.Chrome()

driver.get("https://example.com")

driver.find_element(By.ID,"username").send_keys("admin")

driver.find_element(By.ID,"password").send_keys("1234")

driver.find_element(By.ID,"login").click()

driver.quit()
```

---

# Common Selenium Methods

| Method | Description |
|---------|-------------|
| get() | Open URL |
| click() | Click Element |
| send_keys() | Enter Text |
| clear() | Clear Input |
| close() | Close Current Window |
| quit() | Close Entire Browser |
| back() | Go Back |
| forward() | Go Forward |
| refresh() | Refresh Page |

---

# Advantages of Selenium

- Free and Open Source
- Supports Multiple Browsers
- Supports Multiple Languages
- Large Community
- Easy Integration with PyTest
- Suitable for CI/CD

---

# Limitations of Selenium

- Only Web Applications
- Cannot Test Desktop Applications
- Cannot Automate CAPTCHA
- Cannot Automate OTP Authentication
- Requires Browser Drivers

---

# Best Practices

- Use Explicit Wait instead of Sleep.
- Use Meaningful Variable Names.
- Prefer ID Locator whenever possible.
- Close Browser after Execution.
- Keep Test Scripts Modular.
- Handle Exceptions Properly.

---

# Learning Outcomes

- Selenium Fundamentals
- Selenium Architecture
- Selenium Components
- Installing Selenium
- Browser Drivers
- Browser Commands
- Locators
- XPath
- CSS Selectors
- WebElement Commands
- Waits in Selenium
- Login Automation
- Selenium Best Practices
- Selenium Interview Preparation

---

# Python FSE – Week 5 Study Guide
Advanced Selenium Web Automation

---

# Working with Forms

Selenium can automate web forms by entering text, selecting options, and submitting forms.

Example

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

driver.get("https://example.com")

driver.find_element(By.ID, "username").send_keys("admin")
driver.find_element(By.ID, "password").send_keys("1234")
driver.find_element(By.ID, "login").click()

driver.quit()
```

---

# Radio Buttons

Radio buttons allow selecting only one option.

Example

```python
driver.find_element(By.ID, "male").click()
```

---

# Checkboxes

Checkboxes allow selecting multiple options.

Example

```python
driver.find_element(By.ID, "java").click()
driver.find_element(By.ID, "python").click()
```

---

# Dropdown List

Use the **Select** class to interact with dropdown menus.

Example

```python
from selenium.webdriver.support.ui import Select

dropdown = Select(driver.find_element(By.ID, "country"))

dropdown.select_by_visible_text("India")
```

Other methods

```python
dropdown.select_by_index(2)

dropdown.select_by_value("IN")
```

---

# Handling Alerts

Alerts are popup messages displayed by the browser.

Accept Alert

```python
alert = driver.switch_to.alert

alert.accept()
```

Dismiss Alert

```python
alert.dismiss()
```

Get Alert Text

```python
print(alert.text)
```

Enter Text into Alert

```python
alert.send_keys("Hello")
```

---

# Frames (iFrame)

Frames divide a webpage into multiple sections.

Switch to Frame

```python
driver.switch_to.frame("frameName")
```

Switch Back

```python
driver.switch_to.default_content()
```

---

# Multiple Browser Windows

Open new window

```python
driver.switch_to.window(driver.window_handles[1])
```

Return to first window

```python
driver.switch_to.window(driver.window_handles[0])
```

---

# Mouse Actions

Mouse operations are performed using **ActionChains**.

Import

```python
from selenium.webdriver.common.action_chains import ActionChains
```

Click

```python
actions = ActionChains(driver)

actions.click(element).perform()
```

Double Click

```python
actions.double_click(element).perform()
```

Right Click

```python
actions.context_click(element).perform()
```

Hover Mouse

```python
actions.move_to_element(element).perform()
```

Drag and Drop

```python
actions.drag_and_drop(source, destination).perform()
```

---

# Keyboard Actions

Press Enter

```python
from selenium.webdriver.common.keys import Keys

textbox.send_keys(Keys.ENTER)
```

Other Keys

```python
Keys.TAB

Keys.ESCAPE

Keys.CONTROL

Keys.SHIFT

Keys.DELETE
```

---

# Scrolling Web Page

Scroll Down

```python
driver.execute_script("window.scrollTo(0,500)")
```

Scroll to Bottom

```python
driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")
```

Scroll to Element

```python
driver.execute_script("arguments[0].scrollIntoView();", element)
```

---

# Taking Screenshot

Capture Screenshot

```python
driver.save_screenshot("homepage.png")
```

---

# File Upload

Example

```python
driver.find_element(By.ID,"upload").send_keys("C:\\Users\\File\\resume.pdf")
```

---

# File Download

Example

```python
driver.find_element(By.ID,"download").click()
```

---

# Handling Hidden Elements

Sometimes JavaScript is required.

Example

```python
driver.execute_script("arguments[0].click();", element)
```

---

# JavaScript Executor

Execute JavaScript Code

```python
driver.execute_script("alert('Hello Selenium')")
```

---

# Cookies

Get Cookies

```python
print(driver.get_cookies())
```

Delete Cookies

```python
driver.delete_all_cookies()
```

---

# Common Exceptions

- NoSuchElementException
- TimeoutException
- ElementNotInteractableException
- StaleElementReferenceException
- NoAlertPresentException

---

# Exception Handling

```python
try:
    driver.find_element(By.ID,"login").click()

except Exception as e:
    print(e)
```

---

# Selenium Workflow

```
Start

↓

Launch Browser

↓

Open Website

↓

Locate Elements

↓

Perform Actions

↓

Validate Output

↓

Capture Screenshot

↓

Close Browser

↓

End
```

---

# Best Practices

- Use Explicit Wait whenever possible.
- Avoid using time.sleep().
- Keep scripts modular.
- Reuse common functions.
- Handle exceptions properly.
- Capture screenshots on failures.
- Use Page Object Model for large projects.
- Close browser after execution.

---

# Advantages

- Automates repetitive tasks.
- Improves testing speed.
- Reduces human errors.
- Supports multiple browsers.
- Easy integration with Python.

---

# Learning Outcomes

After completing this part, I learned:

- Form Automation
- Radio Buttons
- Checkboxes
- Dropdown Handling
- Alert Handling
- Frame Handling
- Window Handling
- Mouse Actions
- Keyboard Actions
- Scrolling
- Screenshot Capture
- File Upload
- JavaScript Executor
- Cookies
- Selenium Exception Handling
- Selenium Best Practices

---

# Python FSE – Week 5 Study Guide
Selenium with PyTest & Page Object Model (POM)

---

# Selenium with PyTest

PyTest is a powerful Python testing framework used to write and execute automated test cases efficiently.

### Advantages

- Simple syntax
- Automatic test discovery
- Supports assertions
- Fixtures support
- Detailed test reports
- Easy integration with Selenium

---

# Installing PyTest

Install PyTest using pip.

```bash
pip install pytest
```

Verify Installation

```bash
pytest --version
```

---

# Writing Your First Test

Example

```python
def test_addition():
    assert 10 + 5 == 15
```

Run Test

```bash
pytest
```

---

# Assertions

Assertions verify whether the expected result matches the actual result.

Example

```python
def test_login():
    title = "Home"
    assert title == "Home"
```

Common Assertions

```python
assert a == b

assert a != b

assert x > y

assert value is True

assert value is False
```

---

# PyTest Fixtures

Fixtures prepare the test environment before execution.

Example

```python
import pytest

@pytest.fixture
def browser():

    print("Launch Browser")

    yield

    print("Close Browser")
```

Using Fixture

```python
def test_google(browser):

    print("Testing Google")
```

---

# Data-Driven Testing

Execute the same test with multiple inputs.

Example

```python
import pytest

@pytest.mark.parametrize("a,b,result",

[(2,3,5),

(5,6,11),

(10,20,30)])

def test_add(a,b,result):

    assert a+b==result
```

---

# Page Object Model (POM)

Page Object Model is a design pattern that separates page elements from test scripts.

### Advantages

- Better Code Reusability
- Easy Maintenance
- Improved Readability
- Less Duplicate Code
- Faster Development

---

# POM Structure

```
Project

│

├── pages/

│      login_page.py

│      home_page.py

│

├── tests/

│      test_login.py

│

├── utilities/

│

└── conftest.py
```

---

# Login Page Example

```python
from selenium.webdriver.common.by import By

class LoginPage:

    username=(By.ID,"username")

    password=(By.ID,"password")

    login=(By.ID,"login")

    def __init__(self,driver):

        self.driver=driver

    def login_app(self,user,pwd):

        self.driver.find_element(*self.username).send_keys(user)

        self.driver.find_element(*self.password).send_keys(pwd)

        self.driver.find_element(*self.login).click()
```

---

# Logging

Logging records execution details for debugging.

Example

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.info("Login Successful")
```

---

# HTML Test Report

Generate report

```bash
pytest --html=report.html
```

The report contains

- Passed Tests
- Failed Tests
- Execution Time
- Error Details

---

# Screenshot on Failure

Example

```python
driver.save_screenshot("failed_test.png")
```

Screenshots help identify the reason for failures.

---

# Continuous Integration (CI)

CI automatically executes tests whenever code changes.

Popular CI Tools

- Jenkins
- GitHub Actions
- GitLab CI
- Azure DevOps

Benefits

- Faster Testing
- Automatic Execution
- Early Bug Detection

---

# Selenium Automation Workflow

```
Requirement

↓

Create Test Cases

↓

Develop Selenium Script

↓

Execute Test

↓

Validate Result

↓

Generate Report

↓

Fix Bugs

↓

Retest

↓

Deployment
```

---

# Mini Automation Project

### Project

Automate Login Page

### Steps

1. Open Browser
2. Open Login Page
3. Enter Username
4. Enter Password
5. Click Login
6. Verify Home Page
7. Capture Screenshot
8. Close Browser

---

# Best Practices

- Follow Page Object Model.
- Use Explicit Waits.
- Keep reusable functions separate.
- Write meaningful test names.
- Capture screenshots for failures.
- Generate test reports.
- Maintain clean project structure.
- Use version control (Git).

---

# Learning Outcomes

- PyTest Basics
- Writing Test Cases
- Assertions
- Fixtures
- Data-Driven Testing
- Page Object Model (POM)
- Logging
- HTML Test Reports
- Screenshot Capture
- Continuous Integration Basics
- Selenium Project Structure
- Automation Testing Best Practices
- Selenium Interview Preparation
