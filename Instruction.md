# Deployment and Startup Checklist

This project uses:

- Frontend: Vercel
- Backend: Koyeb
- Database: Neon

---

## 1. Local startup checklist

### Install dependencies

```powershell
cd "c:\Users\Necrosis\.kiro\crew\workspace\extracted\Project"
npm --prefix frontend install
npm --prefix backend install
```

### Create backend env file

```powershell
cd backend
Copy-Item .env.example .env
```

Edit `.env` with:

```env
DATABASE_URL=postgres://postgres:your_password@localhost:5432/web-explore.db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=web-explore.db
DB_SYNCHRONIZE=true
DB_SSL=false
CORS_ORIGIN=http://localhost:5173
NODE_REGISTRATION_TOKEN=replace-with-a-long-random-secret
PORT=3000
```

### Start backend

```powershell
cd "c:\Users\Necrosis\.kiro\crew\workspace\extracted\Project\backend"
npm run start:dev
```

If port 3000 is used already:

```powershell
$env:PORT = "3001"
npm run start:dev
```

### Start frontend

```powershell
cd "c:\Users\Necrosis\.kiro\crew\workspace\extracted\Project\frontend"
npm run dev -- --host 0.0.0.0 --port 5173
```

Open:

```text
http://localhost:5173
```

### Frontend API env

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:3000
```

---

## 2. Neon setup checklist

### Create project and DB

- [ ] Create a Neon project
- [ ] Create a Postgres database
- [ ] Copy the connection string
- [ ] Use it as the `DATABASE_URL` in Koyeb
- [ ] Use it in local backend if testing against Neon

Example:

```env
DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require
```

### Neon env values for this app

```env
DATABASE_URL=...
DB_SYNCHRONIZE=true
DB_SSL=true
```

---

## 3. Koyeb backend deployment checklist

### Create service

- [ ] Go to Koyeb
- [ ] Create a new service
- [ ] Connect GitHub repo
- [ ] Set app root to `backend`
- [ ] Use Dockerfile from `backend/Dockerfile`
- [ ] Set port to `3000`

### Add env vars

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require
DB_SYNCHRONIZE=true
DB_SSL=true
CORS_ORIGIN=https://<your-vercel-app>.vercel.app
NODE_REGISTRATION_TOKEN=replace-with-a-long-random-secret
```

### Deploy

- [ ] Deploy the service
- [ ] Copy the public Koyeb URL
- [ ] Save it for the frontend config

Example:

```text
https://webs-explore-api.koyeb.app
```

---

## 4. Vercel frontend deployment checklist

### Create app

- [ ] Import repo to Vercel
- [ ] Set root directory to `frontend`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Add env vars

```env
VITE_API_URL=https://<your-koyeb-backend-url>
```

Example:

```env
VITE_API_URL=https://webs-explore-api.koyeb.app
```

Also make sure backend CORS matches the deployed frontend domain:

```env
CORS_ORIGIN=https://<your-vercel-app>.vercel.app
```

---

## 5. Test checklist

### Backend test

- [ ] Sign up works
- [ ] Login works
- [ ] Submit website works

Example signup request:

```json
{
  "name": "Demo User",
  "email": "demo@test.com",
  "password": "123456"
}
```

### Frontend test

- [ ] Open login page
- [ ] Sign up or log in
- [ ] Go to submit website
- [ ] Submit a valid website
- [ ] Check the API responds without CORS error

---

## 6. Quick warnings

- [ ] Never push raw `DATABASE_URL` to GitHub
- [ ] Keep all secrets in Koyeb, Vercel, and Neon
- [ ] If frontend cannot reach backend, check `VITE_API_URL`
- [ ] If backend cannot start, check port 3000 and `.env`
- [ ] If DB connection fails, verify Neon or local PostgreSQL is running

---

## 7. Final stack

Recommended production setup:

- Vercel for frontend
- Koyeb for backend
- Neon for PostgreSQL

This is the correct stack for this project.
