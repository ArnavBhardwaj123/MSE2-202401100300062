# Lost & Found — Campus Item Management System

A full-stack MERN web application that lets college students report, search, and manage lost and found items.

## Features

- Register / Login with JWT authentication
- Report Lost or Found items with location, date, and contact info
- View all reported items on a protected dashboard
- Search items by name
- Edit and delete your own entries
- Secure logout

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas + Mongoose          |
| Auth      | bcryptjs (hashing) + JWT          |
| Deploy    | Render (backend + frontend)       |

## Project Structure

```
├── backend/
│   ├── models/        User.js, Item.js
│   ├── routes/        auth.js, items.js
│   ├── middleware/    auth.js (JWT guard)
│   └── server.js
└── frontend/
    └── src/
        ├── components/  Register.js, Login.js, Dashboard.js
        ├── App.js
        └── App.css
```

## API Endpoints

| Method | Endpoint                    | Auth | Description        |
|--------|-----------------------------|------|--------------------|
| POST   | /api/register               | No   | Register user      |
| POST   | /api/login                  | No   | Login user         |
| POST   | /api/items                  | Yes  | Add item           |
| GET    | /api/items                  | Yes  | Get all items      |
| GET    | /api/items/:id              | Yes  | Get item by ID     |
| PUT    | /api/items/:id              | Yes  | Update item        |
| DELETE | /api/items/:id              | Yes  | Delete item        |
| GET    | /api/items/search?name=xyz  | Yes  | Search items       |

> See `DEPLOYMENT_README.md` (local only, not in repo) for full setup & Render deployment steps.
