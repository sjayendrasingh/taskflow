# KanbanFlow - Full-Stack MERN Project Management Tool

KanbanFlow is a highly interactive, production-ready, full-stack project management application modeled after popular platforms like Trello and Jira. Designed with modularity and scalability in mind, it provides an intuitive interface for planning work, managing tasks, and collaborating with team members in real-time.

This project is fully structured, optimized, and ready to showcase in technical interviews and deploy to production.

---

## 🚀 Key Features

- **🔐 Robust Authentication**: Secure user registration and login powered by JWT (JSON Web Tokens) and pre-save `bcryptjs` password hashing.
- **📋 Workspace Management**: Create multiple project boards with custom titles and automatic member collaboration controls.
- **🛠️ Trello-Style Kanban Board**: Drag and drop tasks smoothly between status columns (To-Do, Doing, Done) using native HTML5 Drag and Drop APIs (zero-dependency, optimal performance).
- **📝 Comprehensive Task Controls**: Add, edit, delete, assign tasks to board members, set priority levels (Low, Medium, High), and assign due dates.
- **✨ Premium UI/UX**: Modern dark mode aesthetics with fluid CSS glassmorphic panel elements, micro-interactions, responsive grids, and transitions.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast SPA builder.
- **CSS3 (Modern Variables & Glassmorphism)**: Fully custom, premium design without heavy styling framework bloat.
- **Lucide React**: Clean, modern iconography.
- **Native HTML5 Drag and Drop API**: Scalable drag-and-drop mechanism.

### Backend
- **Node.js & Express.js**: RESTful API design.
- **MongoDB & Mongoose**: Flexible, schema-based NoSQL database management.
- **JWT (JsonWebToken)**: Stateless token-based user authentication.
- **Bcrypt.js**: Cryptographic secure password hashing.

---

## 📁 Project Structure

```
├── backend/
│   ├── middleware/
│   │   └── auth.js         # JWT Authentication Middleware
│   ├── models/
│   │   ├── User.js         # User DB Schema
│   │   ├── Board.js        # Workspace Boards DB Schema
│   │   └── Task.js         # Tasks DB Schema
│   ├── routes/
│   │   ├── auth.js         # Register, Login & User API
│   │   ├── boards.js       # Boards CRUD API
│   │   └── tasks.js        # Tasks CRUD & Drag-n-Drop API
│   ├── .env                # Port, MongoDB URI & JWT Secrets
│   ├── package.json        # Server-side Dependencies
│   └── server.js           # Server Entrance & DB connection
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI Elements (Navbar, TaskCard, Modals)
│   │   ├── context/        # Auth & API State Context Provider
│   │   ├── App.jsx         # App State Coordinator
│   │   ├── index.css       # Core Design Tokens & UI Styles
│   │   └── main.jsx        # App Mount Point
│   ├── package.json        # Client Dependencies
│   └── vite.config.js      # Vite Configuration
│
└── README.md               # Documentation
```

---

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js installed locally.
- MongoDB running locally or a MongoDB Atlas Connection String.

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend/` folder (a template is provided in the repository) and fill in your details:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/trello-clone
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The server will run on `http://localhost:5001`.*

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client application will run on `http://localhost:5173`.*

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create new user account.
- `POST /api/auth/login` - Authenticate user & receive JWT token.
- `GET /api/auth/me` - Fetch authenticated user details (Private).
- `GET /api/auth/users` - Fetch list of all registered users for task assignment (Private).

### Boards
- `GET /api/boards` - Fetch all boards the authenticated user owns or is a member of (Private).
- `GET /api/boards/:id` - Fetch board by ID (Private).
- `POST /api/boards` - Create a board (Private).
- `PUT /api/boards/:id` - Update board title/columns/members (Private).
- `DELETE /api/boards/:id` - Delete board and all associated tasks (Private).

### Tasks
- `GET /api/tasks/board/:boardId` - Fetch all tasks for a specific board (Private).
- `POST /api/tasks` - Create a task within a board (Private).
- `PUT /api/tasks/:id` - Update a task (handles details changes & drag-and-drop column transitions) (Private).
- `DELETE /api/tasks/:id` - Remove a task from the board (Private).

---

## 🧠 Interview Guide: How to Talk About This Project

During interviews, you can present this project as a demonstration of your Full-Stack capabilities:

1. **System Design & CRUD Relationships**: Mention how you modeled the relational aspects (Users to Boards, Boards to Tasks) using Mongoose schemas.
2. **Native Drag & Drop vs. Library Overkill**: Highlight that you implemented the Kanban board using **native HTML5 Drag and Drop API** instead of adding heavy library bloat, showing a deep understanding of DOM event lifecycles.
3. **State Management & Clean API Integration**: Explain how you implemented the `AuthContext` to centralize token management and create an interceptor-like custom fetch wrapper to automatically attach JWT authorization headers to requests.
4. **Security Practices**: Emphasize security considerations, such as password hashing with `bcryptjs` on the database level and JWT verification inside middleware layers.
