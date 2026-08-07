# Simple REST API

> **Codveda Technologies Full-Stack Development Internship**  
> **Level 1 - Task 2: Build a Simple REST API**

---

## 📌 Project Overview

**Simple REST API** is a clean, lightweight backend RESTful web service built with **Node.js** and **Express.js**. It performs CRUD (Create, Read, Update, Delete) operations on task resources following the **Model-View-Controller (MVC)** design pattern.

This API uses structured JSON request/response formats, Express Router, and custom HTTP status codes (200, 201, 400, 404, 500).

---

## 🛠️ Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast web framework for Node.js
- **Nodemon**: Automatic server restarter for development
- **JavaScript (ES6+)**: Modern JavaScript syntax and async/await

---

## 📁 Project Structure

```text
simple-rest-api/
│
├── src/
│   ├── data/
│   │   └── tasks.js          # Sample initial dataset & ID generator
│   ├── controllers/
│   │   └── taskController.js # CRUD business logic handlers
│   ├── routes/
│   │   └── taskRoutes.js     # Express Router endpoint definitions
│   └── server.js             # Main server setup & entry point
│
├── package.json              # Dependencies & npm scripts
├── .gitignore                # Git ignored files
└── README.md                 # Documentation
```

---

## ⚙️ Installation & Setup

### 1. Navigate to Project Folder

```bash
cd simple-rest-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Or for production mode:

```bash
npm start
```

The server will run at:  
`http://localhost:5000`

---

## 📡 API Endpoint Documentation

Base API URL: `http://localhost:5000/api/tasks`

### 1. Create Task

- **Method**: `POST`
- **Endpoint**: `/api/tasks`
- **Request Body**:
  ```json
  {
    "title": "Complete Codveda Task",
    "description": "Build REST API",
    "status": "pending"
  }
  ```
- **Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "id": 3,
      "title": "Complete Codveda Task",
      "description": "Build REST API",
      "status": "pending"
    }
  }
  ```

---

### 2. Get All Tasks

- **Method**: `GET`
- **Endpoint**: `/api/tasks`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "id": 1,
        "title": "Learn Express.js",
        "description": "Build a REST API",
        "status": "pending"
      },
      {
        "id": 2,
        "title": "Complete Codveda Task",
        "description": "Build REST API for internship",
        "status": "in-progress"
      }
    ]
  }
  ```

---

### 3. Get Single Task

- **Method**: `GET`
- **Endpoint**: `/api/tasks/:id`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "Learn Express.js",
      "description": "Build a REST API",
      "status": "pending"
    }
  }
  ```

---

### 4. Update Task

- **Method**: `PUT` or `PATCH`
- **Endpoint**: `/api/tasks/:id`
- **Request Body**:
  ```json
  {
    "status": "completed"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "id": 1,
      "title": "Learn Express.js",
      "description": "Build a REST API",
      "status": "completed"
    }
  }
  ```

---

### 5. Delete Task

- **Method**: `DELETE`
- **Endpoint**: `/api/tasks/:id`
- **Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```

---

## ⚠️ Error Responses

### Task Not Found (`404 Not Found`)

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Invalid Request Data (`400 Bad Request`)

```json
{
  "success": false,
  "message": "Validation Error: Task title is required"
}
```

---

## 🧪 Testing Checklist

| Test Scenario | HTTP Method | Endpoint | Status Code | Result |
| :--- | :--- | :--- | :---: | :---: |
| Create task | `POST` | `/api/tasks` | `201 Created` | ✅ Passed |
| Get all tasks | `GET` | `/api/tasks` | `200 OK` | ✅ Passed |
| Get single task | `GET` | `/api/tasks/1` | `200 OK` | ✅ Passed |
| Update task | `PATCH` / `PUT` | `/api/tasks/1` | `200 OK` | ✅ Passed |
| Delete task | `DELETE` | `/api/tasks/1` | `200 OK` | ✅ Passed |
| Non-existent task | `GET` | `/api/tasks/999` | `404 Not Found` | ✅ Passed |
