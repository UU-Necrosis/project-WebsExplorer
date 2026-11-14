# Deployment

## Services

- Deploy `frontend/` as a Vercel project. Set the Vercel project Root Directory to `frontend`, Framework Preset to Vite, Build Command to `npm run build`, and Output Directory to `dist`.
- Set Vercel's `VITE_BASE_URL` to `/` and `VITE_API_URL` to the public Railway backend origin. These variables are embedded at build time, so redeploy after changing them.
- Deploy the NestJS backend from `backend/` to Railway using the included `backend/Dockerfile`.
- Keep the existing Neon PostgreSQL project as the database. Enter Neon's pooled connection string as the Railway `DATABASE_URL` secret; do not create a Railway database.
- Keep `DATABASE_URL` private. Store it in Railway's environment settings, not in the app source or Vercel.
- If login and sign-up both show a network error, check that Vercel's `VITE_API_URL` is the real Railway service origin and that Railway's `CORS_ORIGIN` exactly matches the Vercel origin. `VITE_BASE_URL` controls frontend asset paths; it is not the API address.
- Do not add a paid Railway plan or database if you want to keep using only the free allowance.

The API currently uses TypeORM synchronization (`DB_SYNCHRONIZE=true`) to create and update its schema. Keep it enabled during this deployment so the submission ownership, URL de-duplication, vote, and cooldown columns are added. Before turning synchronization off, add and apply TypeORM migrations for subsequent production schema changes.

Railway's current [pricing](https://railway.com/pricing) advertises a one-time $5 trial credit for up to 30 days or until the credit is exhausted, whichever comes first, then a Free plan with $1 in monthly usage credits. The monthly credit does not roll over; the service may stop when available credits are exhausted. The pricing page says a credit card is not required for the free trial. Railway's [trial documentation](https://docs.railway.com/pricing/free-trial) also notes that limited-trial accounts have restricted outbound networking. Verify the linked GitHub account to qualify for full-trial network access to Neon. Do not add a payment method or upgrade if no charges are acceptable, and monitor the Railway usage dashboard.

## API

- `POST /api/auth/signup` and `/api/auth/login` create customer sessions; customer-only endpoints require a customer bearer token.
- `POST /api/auth/admin/login` creates an admin session; admin-only endpoints require an admin bearer token.
- `POST /api/submissions` saves a website submission. A canonical URL already in progress is merged into the existing record and credits one vote for the authenticated submitter's role, once per account.
- Customers can retrieve their own submissions at `GET /api/submissions/mine`, their eligible voting queue at `GET /api/submissions/voting`, and their new-submission cooldown at `GET /api/submissions/cooldown`.
- `GET /api/submissions` and `GET /api/websites-saved` are admin-only. Admin votes are recorded at `POST /api/submissions/:id/votes/admin`.
- Customers vote at `POST /api/submissions/:id/votes/client` after five admin votes. A customer cannot vote on their own submission or vote twice.
- After five admin and three distinct customer votes, the API saves the website and exposes it through `GET /api/websites-saved`.
- A customer may create one new URL submission every seven days. Duplicate submissions to an in-progress URL can still add the customer's role-based vote during that period. Admins are exempt.
- `GET /api/audit-logs` and `GET /api/audit-logs/verify` are admin-only. Successful admin logins, submissions, votes, and approvals are recorded in an append-only hash chain.
- `GET /api/nodes` lists registered cluster nodes.
- `POST /api/nodes/heartbeat` inserts or updates a node. Each node process must send `x-node-token: $NODE_REGISTRATION_TOKEN` and report its real ID, name, region, latency, and status.

No node records are seeded. The admin overview remains empty until actual node processes send heartbeats.

## Local API

Copy `backend/.env.example` to `backend/.env`, configure a local PostgreSQL connection, then run:

```powershell
npm --prefix backend run start:dev
```

For local Neon testing, link the project and pull only its pooled database URL to the ignored backend env file:

```powershell
neon link --project-id <project-id> --no-env-pull -y
neon env pull --env DATABASE_URL --file backend/.env.local
```

Set `DB_SSL=true` in `backend/.env.local`. The backend loads `.env.local` before `.env`, so the Neon URL takes precedence over local defaults.

For local frontend development, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_API_URL=http://localhost:3000`.

## Railway deployment (backend) + Neon database

1. Use the existing Neon project and its production branch. For normal app queries, use Neon's pooled connection string (the hostname includes `-pooler`). Keep `DATABASE_URL` private.
2. In Railway, create a project from the GitHub repository and add a service for the backend. Set its root directory to `/backend` and use the included `Dockerfile`. See Railway's [monorepo instructions](https://docs.railway.com/deployments/monorepo); if you configure a Railway config file, its path must be absolute (for example, `/backend/railway.json`).
3. Generate a public domain for the backend service in Railway and set the service health check path to `/`.
4. Configure these variables in the Railway service:

```bash
NODE_ENV=production
DATABASE_URL=<Neon pooled connection string>
DB_SYNCHRONIZE=true
DB_SSL=true
CORS_ORIGIN=https://web-explorer-com-brgd.vercel.app
AUTH_TOKEN_SECRET=<random secret of at least 32 characters>
ADMIN_ACCOUNTS_JSON=[{"id":1,"name":"Admin","email":"admin@example.com","passwordHash":"<lowercase-sha256-hash>"}]
NODE_REGISTRATION_TOKEN=<long random secret>
```

Set `CORS_ORIGIN` to the exact Vercel production origin (scheme included, no path). If production uses a different domain, update it accordingly. Add preview domains only when needed, as a comma-separated list of exact origins; do not use a wildcard. Generate `AUTH_TOKEN_SECRET` and `NODE_REGISTRATION_TOKEN` with a cryptographically secure random value. Keep secrets in Railway's service variables, not in source control.

Railway injects `PORT`, and the NestJS app reads `process.env.PORT`; do not hardcode a production port. The `/` health check returns the API's basic response.

Generate random secrets locally with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Each admin password hash is the lowercase SHA-256 digest of the admin password; generate it locally with:

```powershell
node -e "console.log(require('node:crypto').createHash('sha256').update('your-password').digest('hex'))"
```

Never put production credentials or passwords in source control. Configure `DATABASE_URL`, `ADMIN_ACCOUNTS_JSON`, and the authentication secrets as Railway service variables. Admins must sign in through `/admin/login`; the previous client-only demo session is not accepted by protected API routes.

5. Deploy the service. In Vercel, set `VITE_API_URL` to the exact public Railway origin (for example, `https://webs-explore-api.up.railway.app`) and redeploy the frontend.

This setup matches the app's current NestJS + TypeORM configuration in [backend/src/app.module.ts](backend/src/app.module.ts).

## Frontend routing and content

- `frontend/vercel.json` sends browser routes to `index.html`, allowing React Router routes such as `/discover` and `/admin/login` to load on refresh.
- In Railway, set `CORS_ORIGIN` to the exact Vercel production origin, including `https://` and excluding any path. If both production and preview deployments need API access, provide a comma-separated list of exact origins.
- The database is not seeded with website records. Submit content and complete the configured review votes before it appears in the saved websites directory. Confirm the Railway API is healthy and `GET /api/websites-saved` returns the expected records if the frontend loads but its directory is empty.
