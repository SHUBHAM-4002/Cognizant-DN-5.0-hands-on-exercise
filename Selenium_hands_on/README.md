# Selenium WebDriver Commands Demo

A comprehensive demonstration of **43 Selenium WebDriver commands** using the [Demoblaze](https://www.demoblaze.com) e-commerce website as the test application.

## 📋 Project Overview

This project contains a Python script that systematically demonstrates all major Selenium WebDriver commands including:

- **Browser Navigation**: Open, maximize, minimize, refresh, back, forward
- **Element Locators**: `By.ID`, `By.LINK_TEXT`, `By.CLASS_NAME`, `By.XPATH`
- **User Interactions**: Click, send_keys, scroll, JavaScript execution
- **Waits**: `WebDriverWait` with `expected_conditions`
- **Alerts**: Accept, dismiss, get alert text
- **Window Management**: Switch between multiple windows
- **Screenshots**: Capture page screenshots
- **Verification**: `is_displayed()`, `is_enabled()`, `is_selected()`, `.text`

## 🚀 How to Run

### Prerequisites

- Python 3.x installed
- Chrome browser installed
- ChromeDriver installed (or use `webdriver-manager`)

### Install Dependencies

```bash
pip install selenium
```

### Run the Script

Open **Command Prompt (cmd)** or **PowerShell** and execute:

```bash
cd "c:/Users/Yashm/Desktop/CTS DN 5.0/Hands-On/VS Selenium"
python demoblaze_commands.py
```

> **Note:** If you have moved the project to a different location, update the `cd` path accordingly.

## 📂 Files

| File | Description |
|------|-------------|
| `demoblaze_commands.py` | Main Selenium script with all 43 commands |
| `homepage.png` | Screenshot captured during execution |
| `README.md` | This file |

## 📝 Commands Demonstrated

| # | Command | Description |
|---|---------|-------------|
| 1 | `driver.get()` | Open Website |
| 2 | `driver.maximize_window()` | Maximize Browser |
| 3 | `driver.minimize_window()` | Minimize Browser |
| 4 | `driver.refresh()` | Refresh Page |
| 5 | `driver.back()` | Go Back |
| 6 | `driver.forward()` | Go Forward |
| 7 | `driver.current_url` | Get Current URL |
| 8 | `driver.title` | Get Page Title |
| 9 | `driver.page_source` | Print Page Source |
| 10-12 | `By.LINK_TEXT` | Click Laptops / Phones / Monitors |
| 13 | `By.LINK_TEXT` | Open Product |
| 14 | `By.LINK_TEXT` | Add Product to Cart |
| 15 | `alert.accept()` | Accept Alert |
| 16 | `alert.dismiss()` | Dismiss Alert |
| 17 | `By.ID("cartur")` | Open Cart |
| 18 | `By.LINK_TEXT("Delete")` | Delete Product |
| 19 | `By.ID("login2")` | Open Login Dialog |
| 20 | `send_keys` + `click` | Login |
| 21 | `By.ID("signin2")` | Open Sign Up |
| 22 | `send_keys` | Register User |
| 23 | `By.XPATH` | Close Popup |
| 24 | `By.XPATH("Place Order")` | Purchase Product |
| 25 | `send_keys` | Fill Purchase Form |
| 26 | `By.XPATH("Purchase")` | Click Purchase |
| 27 | `By.CLASS_NAME("sweet-alert")` | Verify Purchase |
| 28 | `By.XPATH("OK")` | Click OK |
| 29 | `.text` | Check Button Text |
| 30 | `.is_displayed()` | Check if Button Exists |
| 31 | `.is_enabled()` | Check if Enabled |
| 32 | `.is_selected()` | Check if Selected |
| 33 | `find_elements` + `len()` | Count Products |
| 34 | Loop with `.text` | Print Product Names |
| 35 | Loop with `.text` | Click Every Product |
| 36 | `WebDriverWait` | Wait Until Element Appears |
| 37 | `save_screenshot()` | Take Screenshot |
| 38 | `execute_script("scrollTo")` | Scroll Down |
| 39 | `execute_script("scrollIntoView")` | Scroll to Element |
| 40 | `execute_script("click()")` | Execute JavaScript Click |
| 41 | `switch_to.window()` | Handle Multiple Windows |
| 42 | `driver.close()` | Close Browser |
| 43 | `driver.quit()` | Quit Browser |

## ✅ Expected Output

When you run the script, you will see the Chrome browser open and perform each action sequentially. The terminal will display status messages for each command, including:

- Page title: `STORE`
- Current URL: `https://www.demoblaze.com/`
- Alert text: `Product added`
- Product count: `6`
- Product names (Sony vaio i5, Sony vaio i7, MacBook air, etc.)
- Purchase confirmation text

A screenshot `homepage.png` will be saved in the project directory.
