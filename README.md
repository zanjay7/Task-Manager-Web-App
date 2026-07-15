# Task Manager App

A simple Task Manager with a React frontend and a Django REST API backend. You can register, log in, and manage your own tasks (add, edit, delete, mark complete).

## What's Inside

- `backend/` — Django REST API (handles login, tasks, database)
- `frontend/` — React app (the UI you see in the browser)

Database is SQLite by default, so there's nothing extra to install or configure.

## Running the Backend

\```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
python manage.py migrate
python manage.py runserver
\```

Backend runs at `http://127.0.0.1:8000`.

## Running the Frontend

Open a **new** terminal (keep the backend one running):

\```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm start
\```

Frontend opens at `http://localhost:3000`.

## Using the App

1. Go to `http://localhost:3000`
2. Click Register, create an account
3. Add tasks, mark them complete, filter by All/Completed/Pending, search, toggle dark mode

## Main API Endpoints

| Method | Endpoint | What it does |
|--------|----------|---------------|
| POST | `/api/auth/register/` | Create an account |
| POST | `/api/auth/login/` | Log in |
| GET/POST | `/api/tasks/` | List or create tasks |
| PUT/PATCH/DELETE | `/api/tasks/{id}/` | Update or delete a task |
| GET | `/api/tasks/stats/` | Task counts + completion % |

## Features

- Login/register with JWT
- Add, edit, delete, complete tasks (private per user)
- Filter (All/Completed/Pending) + search
- Priority, due date, progress bar, dark mode
- Pagination
