# Python FSE - Week 4 Study Guide
## Frontend Development Basics – React, Angular & Vue.js Overview

---

# Introduction to Frontend Development

## What is Frontend Development?

Frontend Development is the process of designing and developing the visual part of a web application that users directly interact with. It focuses on creating attractive, responsive, and user-friendly interfaces using modern web technologies.

Everything visible on a website—such as buttons, menus, forms, images, navigation bars, dashboards, and animations—is developed by frontend developers.

The frontend communicates with the backend server through APIs to fetch and display data dynamically.

---

## Real-Life Example

Consider an Online Shopping Website like Amazon.

### Frontend

- Home Page
- Search Bar
- Product Cards
- Shopping Cart
- Login Page
- Payment Page
- User Dashboard

### Backend

- User Authentication
- Database
- Product Management
- Payment Gateway
- Order Processing

The frontend sends requests to the backend, receives data, and displays it in an attractive format.

---

# Frontend Architecture

```
                  User
                    │
                    ▼
          Web Browser (Chrome)
                    │
                    ▼
        Frontend Application
      (React / Angular / Vue)
                    │
         HTTP Request (API)
                    │
                    ▼
           Backend Server
      (Python FastAPI / Django)
                    │
                    ▼
               Database
```

---

# Responsibilities of a Frontend Developer

A frontend developer is responsible for:

- Designing responsive user interfaces
- Creating interactive web pages
- Connecting APIs
- Handling user events
- Performing client-side validation
- Improving website performance
- Making websites mobile-friendly
- Ensuring browser compatibility

---

# Skills Required

A frontend developer should know:

- HTML5
- CSS3
- JavaScript
- Bootstrap
- React
- Angular
- Vue.js
- REST APIs
- Git & GitHub
- Responsive Design
- Browser Developer Tools

---

# Evolution of Frontend Development

### First Generation

Static HTML pages

Characteristics

- No interaction
- No JavaScript
- Only HTML

Example

```
Welcome to my website.
```

---

### Second Generation

HTML + CSS + JavaScript

Characteristics

- Dynamic content
- User interaction
- Animations
- Form validation

---

### Third Generation

Modern Frameworks

Examples

- React
- Angular
- Vue

Advantages

- Component-based development
- Faster rendering
- Reusable code
- Better maintenance

---

# Web Application

A web application is software that runs inside a browser.

Examples

- Gmail
- Facebook
- YouTube
- Netflix
- Amazon
- LinkedIn

---

# Types of Websites

## Static Website

Characteristics

- Fixed content
- Simple HTML
- No database
- Faster loading

Example

Company Portfolio

---

## Dynamic Website

Characteristics

- Uses Database
- Login system
- User Dashboard
- Interactive content

Example

Instagram

Amazon

Facebook

Netflix

---

# Client-Server Architecture

```
Client
(Browser)

      │

HTTP Request

      │

Server

      │

Database

      │

HTTP Response

      │

Client
```

Explanation

Client requests information.

Server processes request.

Database returns data.

Server sends response.

Browser displays information.

---

# Request Response Cycle

Step 1

User enters

```
www.amazon.com
```

↓

Browser sends request.

↓

Server receives request.

↓

Server processes request.

↓

Database fetches data.

↓

Server sends HTML, CSS and JavaScript.

↓

Browser renders webpage.

---

# Browser

A browser is software used to access websites.

Popular Browsers

- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari
- Opera

---

# Rendering Engine

Every browser has a rendering engine.

Examples

Chrome

Blink

Firefox

Gecko

Safari

WebKit

The rendering engine converts HTML and CSS into the webpage visible on the screen.

---

# Browser Components

```
Browser

│

├── Address Bar

├── Rendering Engine

├── JavaScript Engine

├── Network Layer

├── Storage

└── Developer Tools
```

---

# JavaScript Engine

Responsible for executing JavaScript.

Popular Engines

Chrome

V8 Engine

Firefox

SpiderMonkey

Safari

JavaScriptCore

---

# HTML

HTML stands for HyperText Markup Language.

It provides the structure of a webpage.

Example

```html
<!DOCTYPE html>

<html>

<head>

<title>My Website</title>

</head>

<body>

<h1>Welcome</h1>

<p>Hello World</p>

</body>

</html>
```

Output

```
Welcome

Hello World
```

---

# HTML Document Structure

```
HTML

│

├── Head

│     ├── Title

│     ├── CSS

│     └── Meta

│

└── Body

      ├── Heading

      ├── Paragraph

      ├── Image

      ├── Form

      └── Table
```

---

# Common HTML Tags

Heading

```html
<h1>Main Heading</h1>

<h2>Sub Heading</h2>
```

Paragraph

```html
<p>This is a paragraph.</p>
```

Image

```html
<img src="image.jpg" alt="Image">
```

Link

```html
<a href="https://google.com">Google</a>
```

Button

```html
<button>Submit</button>
```

---

# Lists

Ordered List

```html
<ol>

<li>Apple</li>

<li>Banana</li>

</ol>
```

Unordered List

```html
<ul>

<li>Python</li>

<li>Java</li>

</ul>
```

---

# Tables

```html
<table border="1">

<tr>

<th>Name</th>

<th>Age</th>

</tr>

<tr>

<td>John</td>

<td>22</td>

</tr>

</table>
```

---

# Forms

Forms collect user information.

Example

```html
<form>

<label>Name</label>

<input type="text">

<br>

<label>Password</label>

<input type="password">

<br>

<button>Login</button>

</form>
```

---

# HTML5 Features

- Audio
- Video
- Canvas
- SVG
- Semantic Tags
- Local Storage
- Session Storage
- Geolocation

---

# Semantic Tags

Examples

```html
<header>

<nav>

<section>

<article>

<footer>
```

Advantages

- Better SEO
- Readable Code
- Accessibility
- Maintainability

---

# HTML Best Practices

- Use semantic tags.
- Close all tags properly.
- Use meaningful names.
- Add alt text to images.
- Keep indentation consistent.
- Validate HTML code.

---

# Learning Outcome

After completing Part 1, I learned:

- Frontend Development Fundamentals
- Client-Server Architecture
- Browser Working
- Request-Response Cycle
- HTML Basics
- HTML5 Features
- Semantic HTML
- Forms
- Tables
- Best Practices
- Common Interview Questions

---

# CSS Fundamentals

## What is CSS?

CSS (Cascading Style Sheets) is used to style HTML elements. It controls the layout, colors, fonts, spacing, animations, and responsiveness of a webpage.

Without CSS, web pages appear plain and unorganized.

Example:

```html
<h1>Hello World</h1>
```

Without CSS

```
Black text on white background
```

With CSS

```css
h1{
    color:blue;
    text-align:center;
    font-size:40px;
}
```

Output

```
Blue centered heading
```

---

# Advantages of CSS

- Improves webpage appearance
- Reusable styling
- Faster website loading
- Easy maintenance
- Responsive design
- Better user experience

---

# Types of CSS

## 1. Inline CSS

Applied directly inside an HTML tag.

```html
<h1 style="color:red;">Welcome</h1>
```

Advantages

- Quick testing

Disadvantages

- Difficult to maintain
- Not reusable

---

## 2. Internal CSS

Written inside the `<style>` tag.

```html
<head>

<style>

h1{
color:green;
}

</style>

</head>
```

Advantages

- Good for small projects

---

## 3. External CSS

Stored in a separate file.

style.css

```css
h1{
color:blue;
}
```

HTML

```html
<link rel="stylesheet" href="style.css">
```

Advantages

- Reusable
- Easy maintenance
- Recommended for large projects

---

# CSS Syntax

```css
selector{

property:value;

}
```

Example

```css
p{

color:red;

font-size:18px;

}
```

---

# CSS Selectors

Selectors identify HTML elements to style.

---

## Universal Selector

```css
*{

margin:0;

padding:0;

}
```

---

## Element Selector

```css
h1{

color:blue;

}
```

---

## Class Selector

```css
.title{

color:red;

}
```

HTML

```html
<h1 class="title">Frontend</h1>
```

---

## ID Selector

```css
#header{

background:black;

color:white;

}
```

HTML

```html
<h1 id="header">CTS DN 5.0</h1>
```

---

## Group Selector

```css
h1,p{

color:green;

}
```

---

## Descendant Selector

```css
div p{

color:orange;

}
```

---

# CSS Colors

Ways to specify colors

Named Colors

```css
color:red;
```

RGB

```css
color:rgb(255,0,0);
```

HEX

```css
color:#FF0000;
```

HSL

```css
color:hsl(0,100%,50%);
```

---

# Background

```css
body{

background-color:lightblue;

}
```

Background Image

```css
body{

background-image:url("image.jpg");

background-size:cover;

}
```

---

# Text Properties

```css
h1{

color:blue;

font-size:40px;

font-family:Arial;

font-weight:bold;

text-align:center;

text-transform:uppercase;

}
```

---

# Font Properties

```css
p{

font-family:Verdana;

font-size:20px;

font-style:italic;

}
```

---

# Margin

Space outside the border.

```css
div{

margin:20px;

}
```

---

# Padding

Space inside the border.

```css
div{

padding:15px;

}
```

---

# Border

```css
div{

border:2px solid black;

}
```

---

# CSS Box Model

Every HTML element consists of

```
Margin

↓

Border

↓

Padding

↓

Content
```

Example

```css
div{

margin:20px;

padding:15px;

border:3px solid blue;

}
```

---

# Width and Height

```css
div{

width:300px;

height:200px;

}
```

---

# Display Property

Block

```css
display:block;
```

Inline

```css
display:inline;
```

Inline Block

```css
display:inline-block;
```

None

```css
display:none;
```

---

# Position Property

Static

```css
position:static;
```

Relative

```css
position:relative;
```

Absolute

```css
position:absolute;
```

Fixed

```css
position:fixed;
```

Sticky

```css
position:sticky;
```

---

# Overflow

```css
overflow:hidden;

overflow:auto;

overflow:scroll;
```

---

# Flexbox

Flexbox is used to align items efficiently.

Container

```css
.container{

display:flex;

}
```

Center Alignment

```css
.container{

display:flex;

justify-content:center;

align-items:center;

height:100vh;

}
```

Space Between

```css
justify-content:space-between;
```

Space Around

```css
justify-content:space-around;
```

Direction

```css
flex-direction:row;

flex-direction:column;
```

Wrap

```css
flex-wrap:wrap;
```

---

# CSS Grid

Grid is used for two-dimensional layouts.

```css
.container{

display:grid;

grid-template-columns:1fr 1fr 1fr;

gap:20px;

}
```

Example Layout

```
Card1 Card2 Card3

Card4 Card5 Card6
```

Advantages

- Easy layout creation
- Responsive
- Cleaner code

---

# Responsive Design

Responsive websites adapt to different screen sizes.

Devices

- Mobile
- Tablet
- Laptop
- Desktop

---

# Media Queries

```css
@media(max-width:768px){

body{

background:red;

}

}
```

Example

Desktop

```
Three columns
```

Mobile

```
One column
```

---

# CSS Units

Pixels

```css
font-size:20px;
```

Percentage

```css
width:50%;
```

Viewport Width

```css
width:100vw;
```

Viewport Height

```css
height:100vh;
```

REM

```css
font-size:2rem;
```

EM

```css
font-size:1.5em;
```

---

# CSS Transition

```css
button{

transition:0.5s;

}

button:hover{

background:blue;

}
```

---

# CSS Transform

```css
transform:scale(1.2);
```

Rotate

```css
transform:rotate(45deg);
```

Translate

```css
transform:translateX(100px);
```

---

# CSS Animation

```css
@keyframes move{

from{

left:0;

}

to{

left:200px;

}

}
```

Apply

```css
.box{

animation:move 3s infinite;

}
```

---

# Bootstrap

Bootstrap is a CSS framework for responsive websites.

Advantages

- Ready-made components
- Mobile first
- Responsive Grid
- Faster development

---

# Bootstrap CDN

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

---

# Bootstrap Container

```html
<div class="container">

Hello Bootstrap

</div>
```

---

# Bootstrap Grid

```html
<div class="row">

<div class="col">

Column 1

</div>

<div class="col">

Column 2

</div>

</div>
```

---

# Bootstrap Button

```html
<button class="btn btn-primary">

Save

</button>
```

---

# Bootstrap Card

```html
<div class="card">

<div class="card-body">

Frontend Development

</div>

</div>
```

---

# Bootstrap Navbar

```html
<nav class="navbar navbar-dark bg-dark">

<a class="navbar-brand">

CTS DN 5.0

</a>

</nav>
```

---

# Best Practices

- Use External CSS
- Use meaningful class names
- Keep CSS modular
- Minimize duplication
- Use Flexbox and Grid
- Make pages responsive
- Optimize images
- Use Bootstrap wisely

---

# Common Mistakes

- Excessive inline CSS
- Overusing IDs
- Fixed widths for mobile
- Ignoring browser compatibility
- Poor file organization
- Not testing responsiveness

---

# Learning Outcome

- CSS Fundamentals
- CSS Selectors
- Text Styling
- Colors and Backgrounds
- CSS Box Model
- Margin and Padding
- Flexbox
- CSS Grid
- Responsive Design
- Media Queries
- CSS Animation
- CSS Transition
- Bootstrap Basics
- Best Practices
- Frontend Interview Preparation

---

# Python FSE - Week 4 Study Guide
## Part 3 – JavaScript Essentials

---

# What is JavaScript?

JavaScript (JS) is a programming language used to make web pages interactive and dynamic. It works together with HTML and CSS to create modern web applications.

### Uses

- Form Validation
- Dynamic Content
- Animations
- API Calls
- Games
- Web Applications

---

# Variables

Variables are used to store data.

```javascript
let name = "John";
const age = 22;
var city = "Chennai";
```

### Difference

| Keyword | Reassign | Redeclare |
|----------|----------|-----------|
| var | Yes | Yes |
| let | Yes | No |
| const | No | No |

---

# Data Types

- String
- Number
- Boolean
- Null
- Undefined
- Object
- Array

```javascript
let name = "CTS";
let age = 20;
let isStudent = true;
```

---

# Operators

```javascript
let a = 10;
let b = 5;

console.log(a+b);
console.log(a-b);
console.log(a*b);
console.log(a/b);
```

---

# Conditional Statements

```javascript
let age = 18;

if(age >= 18){
    console.log("Eligible");
}
else{
    console.log("Not Eligible");
}
```

---

# Loops

### For Loop

```javascript
for(let i=1;i<=5;i++){
    console.log(i);
}
```

### While Loop

```javascript
let i=1;

while(i<=5){
    console.log(i);
    i++;
}
```

---

# Functions

```javascript
function add(a,b){
    return a+b;
}

console.log(add(2,3));
```

---

# Arrow Function

```javascript
const add=(a,b)=>a+b;

console.log(add(5,6));
```

---

# Arrays

```javascript
let fruits=["Apple","Orange","Mango"];

console.log(fruits[0]);

fruits.push("Banana");
```

---

# Objects

```javascript
let student={
    name:"John",
    age:21
};

console.log(student.name);
```

---

# DOM Manipulation

```javascript
document.getElementById("title").innerHTML="Welcome";
```

---

# Events

```javascript
<button onclick="show()">Click</button>

<script>

function show(){

alert("Hello");

}

</script>
```

---

# Fetch API

```javascript
fetch("https://jsonplaceholder.typicode.com/users")
.then(response=>response.json())
.then(data=>console.log(data));
```

---

# Local Storage

```javascript
localStorage.setItem("name","John");

console.log(localStorage.getItem("name"));
```

---

# JSON

```javascript
let student={
    "name":"John",
    "age":22
};
```

---

# ES6 Features

- let
- const
- Arrow Functions
- Template Literals
- Destructuring
- Spread Operator
- Modules

---

# Best Practices

- Use `let` and `const`
- Write reusable functions
- Use meaningful variable names
- Handle errors properly
- Keep code simple and readable

---

# Learning Outcome

- JavaScript Basics
- Variables and Data Types
- Operators
- Loops
- Functions
- Arrays and Objects
- DOM Manipulation
- Events
- Fetch API
- Local Storage
- JSON
- ES6 Features
- JavaScript Interview Preparation

---

# Python FSE - Week 4 Study Guide
## Part 4 – React.js Basics

---

# What is React?

React is an open-source JavaScript library developed by **Meta (Facebook)** for building interactive and dynamic user interfaces.

It follows a **Component-Based Architecture**, where the UI is divided into reusable components.

---

# Features of React

- Component-Based Architecture
- Virtual DOM
- One-Way Data Binding
- JSX Syntax
- Fast Rendering
- Reusable Components
- Easy API Integration

---

# Advantages of React

- Easy to Learn
- High Performance
- Reusable Code
- Large Community Support
- SEO Friendly
- Efficient State Management

---

# Installing React

```bash
npx create-react-app myapp

cd myapp

npm start
```

---

# React Folder Structure

```
myapp/

│── src/

│   ├── App.js

│   ├── index.js

│   ├── components/

│   └── styles/

│

└── public/
```

---

# JSX

JSX (JavaScript XML) allows writing HTML inside JavaScript.

Example

```jsx
function App(){

return(

<h1>Hello React</h1>

);

}
```

---

# Components

Components are reusable building blocks of a React application.

### Functional Component

```jsx
function Welcome(){

return(

<h2>Welcome to React</h2>

);

}

export default Welcome;
```

---

# Props

Props are used to pass data from a parent component to a child component.

```jsx
function Student(props){

return(

<h2>{props.name}</h2>

);

}

<Student name="Yashvanth"/>
```

---

# State

State stores dynamic data inside a component.

```jsx
import {useState} from "react";

function Counter(){

const[count,setCount]=useState(0);

return(

<button onClick={()=>setCount(count+1)}>

{count}

</button>

);

}
```

---

# Event Handling

```jsx
function App(){

function show(){

alert("Button Clicked");

}

return(

<button onClick={show}>

Click

</button>

);

}
```

---

# Conditional Rendering

```jsx
let isLogin=true;

return(

isLogin ?

<h2>Welcome</h2>

:

<h2>Please Login</h2>

);
```

---

# List Rendering

```jsx
const fruits=["Apple","Orange","Mango"];

return(

<ul>

{

fruits.map((fruit)=>

<li>{fruit}</li>

)

}

</ul>

);
```

---

# React Hooks

Common Hooks

- useState()
- useEffect()
- useContext()
- useRef()

---

# useEffect Hook

Used for side effects such as API calls.

```jsx
import {useEffect} from "react";

useEffect(()=>{

console.log("Component Loaded");

},[]);
```

---

# API Integration

```jsx
fetch("https://jsonplaceholder.typicode.com/users")

.then(res=>res.json())

.then(data=>console.log(data));
```

---

# React Router

Used for page navigation.

Install

```bash
npm install react-router-dom
```

Example

```jsx
<Route path="/home" element={<Home/>}/>
```

---

# React Lifecycle

```
Component Created

↓

Render

↓

Update

↓

Destroy
```

---

# Best Practices

- Use Functional Components
- Use Hooks
- Keep Components Small
- Use Meaningful Names
- Avoid Repeated Code
- Organize Project Structure

---

# Coding Practice

- Counter Application
- Todo List
- Login Form
- Calculator
- Weather App
- Student Management
- Product List
- API Fetch Example
- Image Gallery
- Dashboard UI

---

# Learning Outcome

- React Basics
- JSX
- Components
- Props
- State
- Event Handling
- Conditional Rendering
- List Rendering
- React Hooks
- API Integration
- React Router
- React Interview Preparation
