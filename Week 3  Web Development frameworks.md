# Python FSE - Week 3

* Frontend Development Basics
* HTML Fundamentals
* CSS Fundamentals
* JavaScript Basics
* React.js Framework
* Angular Framework
* Vue.js Overview
* Frontend Routing
* API Integration
* Frontend Interview Preparation

---

# 1. Frontend Development Basics

## What is Frontend Development?

Frontend Development is the process of building the user interface and user experience of a web application.

It focuses on everything that users see and interact with inside a browser.

Examples:

* Buttons
* Forms
* Navigation bars
* Dashboards
* Web Pages
* Animations

---

# Frontend Architecture

```
User
 |
Browser
 |
Frontend Application
 |
API Request
 |
Backend Server
 |
Database
```

---

# Frontend Technologies

## HTML

Used for creating webpage structure.

## CSS

Used for styling webpages.

## JavaScript

Used for adding logic and interaction.

## Frameworks

Popular frontend frameworks:

* React.js
* Angular
* Vue.js

---

# 2. HTML Fundamentals

## What is HTML?

HTML stands for HyperText Markup Language.

It creates the structure of web pages.

---

## Basic HTML Structure

```html
<!DOCTYPE html>

<html>

<head>

<title>
My Website
</title>

</head>


<body>

<h1>Hello World</h1>

<p>This is my first page</p>

</body>


</html>
```

---

# Important HTML Tags

## Heading Tags

```html
<h1>Main Heading</h1>

<h2>Sub Heading</h2>
```

## Paragraph

```html
<p>This is paragraph</p>
```

## Image

```html
<img src="image.jpg">
```

## Link

```html
<a href="google.com">
Visit
</a>
```

## Button

```html
<button>
Click
</button>
```

---

# HTML Forms

Forms collect user input.

Example:

```html
<form>

<input 
type="text" 
placeholder="Username">


<input 
type="password"
placeholder="Password">


<button>
Submit
</button>


</form>
```

---

# 3. CSS Fundamentals

## What is CSS?

CSS stands for Cascading Style Sheets.

It controls webpage design.

---

# Types of CSS

## 1. Inline CSS

```html
<h1 style="color:red">

Hello

</h1>
```

## 2. Internal CSS

```html
<style>

h1{

color:blue;

}

</style>
```

## 3. External CSS

style.css

```css
h1{

color:green;

}
```

---

# CSS Selectors

## Element Selector

```css
p{

color:red;

}
```

## Class Selector

```css
.box{

background:black;

}
```

## ID Selector

```css
#title{

font-size:30px;

}
```

---

# CSS Box Model

Every HTML element contains:

Content

↓

Padding

↓

Border

↓

Margin

Example:

```css
div{

margin:10px;

padding:20px;

border:2px solid black;

}
```

---

# Flexbox

Used for responsive layouts.

Example:

```css
.container{

display:flex;

justify-content:center;

align-items:center;

}
```

---

# 4. JavaScript Basics

## What is JavaScript?

JavaScript adds dynamic behaviour to websites.

Uses:

* Form Validation
* API Calls
* Animations
* Dynamic Content

---

# Variables

```javascript
let name="John";

const age=20;

var city="Chennai";
```

---

# Data Types

Primitive Types:

* String
* Number
* Boolean
* Undefined
* Null

Example:

```javascript
let a=10;

let name="CTS";

let status=true;
```

---

# Functions

Reusable block of code.

Example:

```javascript
function add(a,b){

return a+b;

}


console.log(add(2,3));
```

Output:

```
5
```

---

# Arrow Functions

Modern JavaScript function syntax.

Example:

```javascript
const add=(a,b)=>{

return a+b;

}
```

---

# Arrays

```javascript
let arr=[10,20,30];


arr.push(40);


console.log(arr);
```

---

# Objects

```javascript
let employee={

name:"John",

salary:50000

};


console.log(employee.name);
```

---

# DOM Manipulation

DOM means Document Object Model.

Changing webpage dynamically.

Example:

```javascript
document.getElementById("title")
.innerHTML="Hello";
```

---

# 5. React.js

# What is React?

React is a JavaScript library used for building user interfaces.

Developed by Meta.

Used for creating Single Page Applications (SPA).

---

# Features of React

* Component Based
* Virtual DOM
* Fast Rendering
* Reusable Components
* JSX Support
* One Way Data Flow

---

# Install React

Using Vite:

```bash
npm create vite@latest myapp


cd myapp


npm install


npm run dev
```

---

# React Project Structure

```
src

 |
 |--components

 |
 |--App.jsx

 |
 |--main.jsx
```

---

# JSX

JSX allows writing HTML inside JavaScript.

Example:

```javascript
function App(){

return(

<h1>Hello React</h1>

)

}
```

---

# React Components

Components are reusable UI blocks.

Example:

```javascript
function Header(){

return(

<h1>Welcome</h1>

)

}


export default Header;
```

---

# Props

Props transfer data from parent to child.

Example:

```javascript
function Student(props){

return(

<h1>{props.name}</h1>

)

}
```

---

# State

State stores component data.

Example:

```javascript
import {useState} from "react";


function Counter(){


const[count,setCount]=useState(0);


return(

<button 
onClick={()=>setCount(count+1)}>


{count}


</button>

)

}
```

---

# React Hooks

Hooks allow functional components to use React features.

Important Hooks:

* useState()
* useEffect()
* useContext()
* useRef()

---

# useEffect Hook

Used for side effects.

Example:

```javascript
useEffect(()=>{


console.log("Component Loaded");


},[]);
```

---

# React Router

Used for page navigation.

Install:

```bash
npm install react-router-dom
```

Example:

```javascript
<Route 

path="/home"

element={<Home/>}

/>
```

---

# API Calling in React

Using fetch:

```javascript
fetch(url)

.then(response=>response.json())

.then(data=>console.log(data));
```

---

# Week 3 Learning Outcome

After completing this section:

* HTML Fundamentals
* CSS Styling
* JavaScript Basics
* DOM Manipulation
* React Components
* React Hooks
* State Management
* API Integration
* React Routing
