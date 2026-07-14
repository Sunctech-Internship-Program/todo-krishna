# Todo App

A simple full-stack Todo application built to understand how APIs actually work and how a frontend talks to a backend over HTTP, and how data flows between them.

## What it does

You can add a todo (with a title and description), mark it as completed or not, edit it, and delete it. Everything you do on the frontend is saved permanently in the backend's database — nothing is stored only in the browser.

## Tech used

**Backend — Django + Django REST Framework (DRF)**
Django handles the project structure, the database, and the admin panel. On top of that, DRF is used to expose the data as a REST API meaning instead of Django rendering HTML pages, it just returns JSON, which any frontend (or even Postman) can read and use.

- `models.py` — defines the `Todo` model with fields: `title`, `description`, `completed`, `created_at`.
- `serializers.py` — converts `Todo` objects to/from JSON. This is what lets Django "speak" JSON to the outside world.
- `views.py` — the actual API endpoints (using DRF's `@api_view` decorator), handling `GET`, `POST`, `PUT`, and `DELETE` requests.
- `urls.py` — maps URLs like `/api/todo/` and `/api/todo/<id>/` to those views.
- `django-cors-headers` — Django blocks requests from other origins by default (browser security). Since React runs on a different port (`5173`) than Django (`8000`), CORS headers had to be explicitly allowed so the browser doesn't block the requests.

**Frontend — React (with JSX)**
React handles everything the user sees and interacts with. It's a single component (`TodoApp.jsx`) that:
- Fetches all todos from the Django API when the page loads (`GET /api/todo/`)
- Sends a new todo to the backend when the "Add" button is clicked (`POST /api/todo/`)
- Updates a todo's title or completed status (`PUT /api/todo/<id>/`)
- Removes a todo (`DELETE /api/todo/<id>/`)

No extra libraries were used on the frontend - just React's built-in `useState` and `useEffect` hooks, and the browser's native `fetch()` to talk to the API.

**Containerization — Docker**
A `Dockerfile` and `docker-compose.yml` are included so the Django backend can be built and run inside a container, independent of whatever's installed on the host machine.

## How the pieces connect

```
React (localhost:5173)  --fetch()-->  Django REST API (localhost:8000/api/todo/)  -->  SQLite database
```

React never talks to the database directly — it only ever talks to the API. The API is the single source of truth, whether the request comes from the React app, the Django admin panel, or any other client.

## Running it locally-

**Backend:**
```bash
cd Assignment_3
source venv/bin/activate
python manage.py runserver
```

**Frontend** (separate terminal):
```bash
cd Assignment_3/todo-frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.
