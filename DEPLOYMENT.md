# Deployment

## Services

- Deploy `frontend/` as a Vercel project. Set the Vercel project Root Directory to `frontend`, Framework Preset to Vite, Build Command to `npm run build`, and Output Directory to `dist`.
- Set Vercel's `VITE_BASE_URL` to `/` and `VITE_API_URL` to the public Koyeb backend origin. These variables are embedded at build time, so redeploy after changing them.
- For a Neon + Koyeb setup, deploy the NestJS backend from the `backend/` directory using the included `backend/Dockerfile`, then set environment variables in Koyeb.
- Keep `DATABASE_URL` private. Store it as a Koyeb or Neon secret, not in the app source.
- If login and sign-up both show a network error, check that Vercel's `VITE_API_URL` is the real Koyeb service origin (not the example placeholder) and that Koyeb's `CORS_ORIGIN` exactly matches the Vercel origin. `VITE_BASE_URL` controls frontend asset paths; it is not the API address.
- `render.yaml` is a legacy Render setup; do not deploy it for the Vercel/Koyeb/Neon architecture because it provisions a separate Render database.

The API currently uses TypeORM synchronization (`DB_SYNCHRONIZE=true`) to create and update its schema. Keep it enabled during this deployment so the submission ownership, URL de-duplication, vote, and cooldown columns are added. Before turning synchronization off, add and apply TypeORM migrations for subsequent production schema changes.

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

## Koyeb deployment (backend) + Neon database

1. Use the existing Neon project and its production branch. Keep `DATABASE_URL` private.
2. In Koyeb, create a new service from the GitHub repo and choose the `backend/` directory as the app root.
3. Use the included `backend/Dockerfile` for the build and set the service port to `3000`.
4. Add these environment variables in Koyeb:

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgres://<user>:<password>@<host>/<database>?sslmode=require
DB_SYNCHRONIZE=true
DB_SSL=true
CORS_ORIGIN=https://<your-vercel-app>.vercel.app
NODE_REGISTRATION_TOKEN=<random-long-secret>
AUTH_TOKEN_SECRET=<random-secret-at-least-32-characters>
ADMIN_ACCOUNTS_JSON=[{"id":1,"name":"Admin","email":"admin@example.com","passwordHash":"<sha256-password-hash>"}]
```

Generate `AUTH_TOKEN_SECRET` with a cryptographically secure random value and keep it consistent across all Koyeb instances. Each admin password hash is the lowercase SHA-256 digest of the admin password; generate one locally with:

```powershell
node -e "console.log(require('node:crypto').createHash('sha256').update('your-password').digest('hex'))"
```

Never put production credentials or passwords in source control. Configure the secrets in Koyeb's environment settings. Admins must sign in through `/admin/login`; the previous client-only demo session is not accepted by protected API routes.

5. Deploy the service and set its exact public origin as Vercel's `VITE_API_URL`.

This setup matches the app’s current NestJS + TypeORM configuration in [backend/src/app.module.ts](backend/src/app.module.ts).

## Frontend routing and content

- `frontend/vercel.json` sends browser routes to `index.html`, allowing React Router routes such as `/discover` and `/admin/login` to load on refresh.
- In Koyeb, set `CORS_ORIGIN` to the exact Vercel production origin, including `https://` and excluding any path. If both production and preview deployments need API access, provide a comma-separated list of exact origins.
- The database is not seeded with website records. Submit content and complete the configured review votes before it appears in the saved websites directory. Confirm the Koyeb API is healthy and `GET /api/websites-saved` returns the expected records if the frontend loads but its directory is empty.
