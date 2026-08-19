# Task Manager Authentication Platform

An upgraded, production-ready full-stack Task Manager application built for the **Codveda Full-Stack Development Internship (Level 2)**. This project seamlessly integrates **Level 2 Task 1** (Frontend with React Framework) and **Level 2 Task 2** (Authentication & Authorization with bcrypt, JWT in HTTP-Only Cookies, MongoDB/Mongoose, and Role-Based Access Control).

---

## Completed Level-2 Tasks

- **Level 2 Task 1 — Frontend with a JavaScript Framework**:
  Built using React, Vite, React Router DOM, functional components, hooks (`useState`, `useEffect`, `useContext`), custom state context (`AuthContext`), and reusable UI components.

- **Level 2 Task 2 — Authentication and Authorization**:
  Implemented secure User registration, login with `bcryptjs` password hashing, JWT generation stored in `HTTP-only` cookies, token verification middleware (`authMiddleware`), role-based access control middleware (`roleMiddleware`), task ownership validation, and protected routes (`/dashboard`, `/admin`).

---

## Features

### Frontend (React + Vite)
- **Authentication Pages**: Responsive Login and Registration forms with real-time validation and loading feedback.
- **User Dashboard**: Personal task overview metrics, creation/edit task forms, and interactive task cards.
- **Admin Dashboard**: System-wide analytics accessible strictly to users with the `admin` role.
- **Protected Routes**: Client-side route guards enforcing authentication and role permissions.
- **State Management**: Centralized `AuthContext` for managing user profile and session status.
- **Centralized API Service**: Encapsulated `fetch` calls sending HTTP-only cookies (`credentials: 'include'`).

### Backend (Node.js + Express + MongoDB)
- **Bcrypt Password Security**: Passwords are securely salted and hashed before database storage.
- **HTTP-Only Cookie JWT Storage**: Eliminates XSS risk by storing JWT tokens inside HTTP-only cookies.
- **User Roles (`user` & `admin`)**: Default role is `user`. Role middleware enforces endpoint restrictions.
- **Task Ownership Enforcement**: Users can only create, update, or delete their own tasks (Admins have full oversight).
- **Comprehensive API Response Standards**: Uniform JSON structure with accurate HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500).

---

## Technology Stack

- **Frontend**: React 18, Vite, JavaScript, React Router DOM, Lucide Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, JavaScript
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: `bcryptjs` (hashing), `jsonwebtoken` (JWT), `cookie-parser` (HTTP-only cookies)
- **API**: RESTful API with CORS enabled for `http://localhost:5173`

---

## Project Structure

```
Task-Manager-Level-2/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── README.md
```

---

## Environment Variables Configuration

Create a `.env` file in the `backend/` directory based on `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager-db
JWT_SECRET=super_secret_jwt_key_task_manager_2026
CLIENT_URL=http://localhost:5173
```

---

## Setup & Running Instructions

### 1. MongoDB Setup
Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017` or provide a valid MongoDB Atlas connection string in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
> Backend API will be available at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> Frontend client will be running at `http://localhost:5173`.

---

## Authentication & Authorization Flow

```
1. Register / Login Form (React)
           ↓
2. POST /api/auth/register or /login
           ↓
3. Express Server verifies / hashes password via bcrypt
           ↓
4. Server generates JWT payload containing { id, role }
           ↓
5. Server sends JWT inside HTTP-only Cookie ('token')
           ↓
6. Frontend executes GET /api/auth/me to initialize AuthContext
           ↓
7. Authenticated requests send HTTP-only Cookie automatically
           ↓
8. authMiddleware verifies JWT & populates req.user
           ↓
9. roleMiddleware checks req.user.role for protected paths (e.g. /api/admin)
```

---

## API Endpoints

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with hashed password & HTTP-only JWT cookie |
| `POST` | `/api/auth/login` | Public | Authenticate credentials & return HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | Private | Clear authentication cookie |
| `GET` | `/api/auth/me` | Private | Retrieve currently authenticated user profile |

### Task Endpoints (`/api/tasks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Private | Fetch tasks owned by logged-in user (or all if admin) |
| `POST` | `/api/tasks` | Private | Create a new task assigned to logged-in user |
| `PATCH` | `/api/tasks/:id` | Private | Update task details/status (Owner or Admin) |
| `DELETE` | `/api/tasks/:id` | Private | Delete task (Owner or Admin) |

### Administrative Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin` | Admin Only | Get system stats (Users count, tasks breakdown) |

---

## Testing Instructions (Postman / Thunder Client)

1. **Register User**:
   `POST http://localhost:5000/api/auth/register`
   ```json
   {
     "name": "Amit Chandra Das",
     "email": "amit@example.com",
     "password": "password123"
   }
   ```
2. **Login User**:
   `POST http://localhost:5000/api/auth/login`
   ```json
   {
     "email": "amit@example.com",
     "password": "password123"
   }
   ```
3. **Get Current User**:
   `GET http://localhost:5000/api/auth/me` (Ensure cookies are enabled)
4. **Create Task**:
   `POST http://localhost:5000/api/tasks`
   ```json
   {
     "title": "Complete Level 2 Task",
     "description": "Build React frontend and Express JWT auth",
     "status": "in-progress"
   }
   ```
5. **Get Tasks**: `GET http://localhost:5000/api/tasks`
6. **Access Admin Route**: `GET http://localhost:5000/api/admin` (Returns 403 for standard user, 200 for user with `role: "admin"`).

---

## Screenshots Section

*(Insert screenshots of Login, Registration, Dashboard, and Admin Panel here)*
