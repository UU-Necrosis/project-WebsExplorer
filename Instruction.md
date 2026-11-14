# Deployment and Startup Checklist

This project uses:

- Frontend: Vercel
- Backend: Railway
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
- [ ] Use it as the `DATABASE_URL` secret in Railway
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

## 3. Railway backend deployment checklist

### Create the backend service

- [ ] Create a Railway project from the GitHub repository
- [ ] Add a service for the backend and set its root directory to `/backend`
- [ ] Use the included `backend/Dockerfile`
- [ ] Select Singapore if available to keep the service near the Neon database
- [ ] Do not create a Railway PostgreSQL database; the app uses the existing Neon project
- [ ] Generate a public domain and set the service health check path to `/`

### Add env vars

```env
NODE_ENV=production
DATABASE_URL=<Neon pooled connection string>
DB_SYNCHRONIZE=true
DB_SSL=true
CORS_ORIGIN=https://web-explorer-com-brgd.vercel.app
AUTH_TOKEN_SECRET=<random secret of at least 32 characters>
ADMIN_ACCOUNTS_JSON=[{"id":1,"name":"Admin","email":"admin@example.com","passwordHash":"<lowercase-sha256-hash>"}]
NODE_REGISTRATION_TOKEN=<long random secret>
```

Railway supplies `PORT`; do not set it manually. Set `CORS_ORIGIN` to the exact production Vercel origin. Keep secrets in Railway service variables, not in source control.

Generate `AUTH_TOKEN_SECRET` and `NODE_REGISTRATION_TOKEN` as random secrets locally:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

### Deploy

- [ ] Deploy the service
- [ ] Copy the public Railway URL
- [ ] Save it for the frontend config

Example:

```text
https://webs-explore-api.up.railway.app
```

Use the exact public domain Railway generates for your service; the example domain may not be available.

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
VITE_API_URL=https://<your-railway-backend-url>
```

Example:

```env
VITE_API_URL=https://webs-explore-api.up.railway.app
```

Also make sure backend CORS matches the deployed frontend domain:

```env
CORS_ORIGIN=https://<your-vercel-app>.vercel.app
```

Redeploy the Vercel frontend after changing `VITE_API_URL`; Vite embeds it at build time.

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
- [ ] Keep all secrets in Railway and Neon; only `VITE_API_URL` belongs in Vercel
- [ ] If frontend cannot reach backend, check `VITE_API_URL`
- [ ] If backend cannot start, check Railway deploy logs and environment variables
- [ ] If DB connection fails, verify Neon or local PostgreSQL is running
- [ ] Do not add a paid Railway plan or Railway database if only the free allowance should be used
- [ ] Verify the linked GitHub account to enable full-trial outbound network access to Neon
- [ ] Monitor Railway credits; the $5 trial credit lasts up to 30 days, then the Free plan includes $1 in monthly usage credits
- [ ] Do not add a payment method if the account must not incur charges; the service may stop when its available credits are exhausted

---

## 7. Deployment stack

Current deployment setup:

- Vercel for frontend
- Railway for backend
- Neon for PostgreSQL

Railway's free trial and monthly Free-plan credit are usage-limited and do not guarantee that the backend will stay online continuously.
