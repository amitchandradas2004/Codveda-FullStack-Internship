# Task Manager Frontend Application

> **Codveda Technologies - Full-Stack Development Internship**  
> **Level 1 Task 3: Build a Frontend Application using Vanilla JavaScript & Fetch API**

---

## 📌 Project Overview

The **Task Manager Frontend** is a clean, modern, and fully responsive web interface built using standard web technologies (**HTML5**, **CSS3**, and **Vanilla JavaScript**). It integrates seamlessly with the Express.js REST API backend built in **Level-1 Task-2** (`http://localhost:5000/api/tasks`) to perform full CRUD (Create, Read, Update, Delete) operations asynchronously using the native **Fetch API**.

---

## ✨ Features

- 🎯 **Task Dashboard UI**: Sleek dark/slate theme with glassmorphism touches, top metrics overview cards (Total, Pending, In Progress, Completed), and status indicator for API connection.
- ➕ **Add Task Feature**: Form validation for creating new tasks with title, description, and status (`pending`, `in-progress`, `completed`). Sends `POST` requests to backend.
- 📋 **Display All Tasks**: Dynamic loading and rendering of tasks fetched via `GET` requests on initial page load.
- 🔄 **Update Task Feature**: Instant status toggle or full detail editing modal via `PATCH` requests (`http://localhost:5000/api/tasks/:id`).
- 🗑️ **Delete Task Feature**: Interactive deletion modal confirmation before executing `DELETE` requests (`http://localhost:5000/api/tasks/:id`).
- 🔍 **Real-Time Search & Status Filter**: Live text search and dropdown status filtering without page reloads.
- ⚡ **Toast Notification System**: Instant user-friendly feedback alerts for operations and errors.
- 📱 **Fully Responsive Layout**: 2–3 cards per row on desktop screens, transitioning smoothly to a single-column layout on mobile devices.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic elements (`<header>`, `<main>`, `<section>`, `<article>`, `<form>`, `<footer>`).
- **CSS3**: Custom CSS Variables, Flexbox, CSS Grid, Glassmorphism, Micro-animations, Google Fonts (`Plus Jakarta Sans`).
- **Vanilla JavaScript (ES6+)**: `async/await`, `try/catch`, DOM manipulation, event delegation, client-side validation.
- **Fetch API**: Asynchronous HTTP client for `GET`, `POST`, `PATCH`, and `DELETE` methods.

---

## 📁 Project Structure

```
Task-3-Frontend-JavaScript/
│
├── index.html          # Main HTML structure & semantic layout
├── style.css           # Custom responsive styles & CSS variables
├── script.js           # Fetch API calls, CRUD functions & DOM manipulation
├── README.md           # Documentation & guide
└── screenshots/        # Application preview screenshots
```

---

## 🌐 API Integration Details

The application communicates with the backend API running at `http://localhost:5000/api/tasks`.

| Feature | HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Get Tasks** | `GET` | `http://localhost:5000/api/tasks` | Fetches all tasks from backend |
| **Create Task** | `POST` | `http://localhost:5000/api/tasks` | Creates a new task object |
| **Update Task** | `PATCH` | `http://localhost:5000/api/tasks/:id` | Updates task status or details |
| **Delete Task** | `DELETE` | `http://localhost:5000/api/tasks/:id` | Removes task by ID |

---

## 🚀 How to Run the Project

### Step 1: Start the REST API Backend (Task 2)
Ensure the backend server from **Task-2-REST-API** is running on port `5000`.

```bash
# Navigate to Task 2 directory
cd ../Task-2-Build-a-Simple-REST-API/simple-rest-api

# Install dependencies (if not already done)
npm install

# Start backend server
npm start
```

*Server should output:*
```
🚀 Simple REST API Server running on port 5000
🌐 Base API Endpoint: http://localhost:5000/api/tasks
```

### Step 2: Open Task 3 Frontend
Open `index.html` in your web browser:

- **Method A**: Double-click `index.html` to open directly in standard browser.
- **Method B (Recommended)**: Use Live Server extension in VS Code or any static web server (e.g. `npx serve .` or `python -m http.server 3000`).

---

## 🧪 Verification & Testing Checklist

- [x] **Load All Tasks (`getTasks`)**: Connects to backend on page load and renders existing tasks.
- [x] **Create Task (`createTask`)**: Submits form data, clears fields, and refreshes the task list.
- [x] **Update Task (`updateTask`)**: Modifies task status via button/modal and updates UI.
- [x] **Delete Task (`deleteTask`)**: Confirms deletion and removes task from server and UI.
- [x] **Error Handling**: Displays connection error banners if backend is offline.
- [x] **Mobile Responsiveness**: Adapts dynamically across screen widths.

---

## 👨‍💻 Author

**Amit Chandra Das**  
*Codveda Technologies Full-Stack Development Intern*
