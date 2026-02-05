# EduBoard Backend

EduBoard backend API built with Node.js, Express, PostgreSQL, and Sequelize. It provides authentication, class categories, classes, and lessons (with media uploads).

## Tech stack
- Node.js + Express
- PostgreSQL + Sequelize
- JWT auth (access + refresh tokens)
- Multer for media uploads

## Project structure
- `index.js` – app entry, routes, DB sync, static uploads
- `app/config/db.config.js` – Sequelize DB config
- `app/models` – Sequelize models and associations
- `app/controllers` – request handlers
- `app/middleware` – auth/validation/upload middleware
- `app/routes` – API routes
- `uploads/` – uploaded media (created at runtime)

## Setup
1. Install dependencies:

```bash
npm install
```

2. Create `.env` in the project root (see **Environment variables** below).

3. Start the server:

```bash
npm run dev
# or
npm start
```

Server runs at `http://localhost:3000` by default.

## Deployed URL
Render: `https://eduboard-dste.onrender.com`

## Environment variables
Create a `.env` file in the root directory:

```env
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
HOST=your_db_host
DB_PORT=5432
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
PORT=3000
```

## API
Base URL (local): `http://localhost:3000/api`
Base URL (render): `https://eduboard-dste.onrender.com/api`

### Auth
- `POST /auth/signup` – create account
  - body: `{ email, password, confirmPassword }`
- `POST /auth/login` – login
  - body: `{ email, password }`
- `POST /auth/refresh-token` – refresh access token
  - body: `{ refreshToken }`
- `POST /auth/logout` – logout (requires auth)
- `GET /auth/profile` – current user (requires auth)

### Class categories (requires auth)
- `POST /class-category/create` – create category
  - body: `{ name }`
- `GET /class-category` – list categories
- `GET /class-category/:id` – get category by id
- `PUT /class-category/:id/update` – update category
  - body: `{ name }`
- `DELETE /class-category/:id/delete` – delete category

### Classes (requires auth)
- `POST /class/create` – create class
  - body: `{ name, description?, categoryId? }`
- `GET /class` – list classes (with category)
- `GET /class/:id` – get class by id
- `PUT /class/:id/update` – update class
  - body: `{ name, description?, categoryId? }`
- `DELETE /class/:id/delete` – delete class

### Lessons (requires auth)
- `POST /lesson/create` – create lesson (multipart/form-data)
  - fields: `name`, `classId`, `text?`, `image?`, `video?`, `folderId?`
- `GET /lesson` – list lessons (with class)
- `GET /lesson/:id` – get lesson by id
- `PUT /lesson/:id/update` – update lesson (multipart/form-data)
  - fields: `name`, `classId`, `text?`, `image?`, `video?`, `folderId?`
- `DELETE /lesson/:id/delete` – delete lesson

### Folders (requires auth)
- `POST /folder/create` – create folder
  - body: `{ name, classId, parentId?, orderIndex? }`
- `GET /folder?classId=...` – list folders by class
- `GET /folder/:id` – get folder by id
- `PUT /folder/:id/update` – update folder
  - body: `{ name }`
- `PUT /folder/:id/reorder` – update folder order
  - body: `{ orderIndex }`
- `PUT /folder/:id/move` – move folder between class/parent
  - body: `{ classId?, parentId?, orderIndex? }`
- `DELETE /folder/:id/delete` – delete folder (also deletes lessons inside)

### Auth header
For protected routes:

```
Authorization: Bearer <accessToken>
```

## Uploads
Uploaded lesson media is saved under `uploads/lessons` and served via:

```
GET /uploads/<path>
```

Example: `http://localhost:3000/uploads/lessons/your-file.jpg`

## Notes
- DB is synchronized on server start (`sequelize.sync({ alter: false })`).
- Access tokens expire in 15 minutes; refresh tokens in 7 days.
