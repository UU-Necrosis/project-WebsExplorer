# Deployment

## Services

- Deploy `frontend/` as a Vercel project. Set the Vercel project Root Directory to `frontend`, Framework Preset to Vite, Build Command to `npm run build`, and Output Directory to `dist`.
- Set Vercel's `VITE_BASE_URL` to `/` and `VITE_API_URL` to the public backend origin, for example `https://webs-explore-api.koyeb.app` or the Render service URL shown in the dashboard. These variables are embedded at build time, so redeploy after changing them.
- For a Neon + Koyeb setup, deploy the NestJS backend from the `backend/` directory using the included `backend/Dockerfile`, then set environment variables in Koyeb.
- Keep `DATABASE_URL` private. Store it as a Koyeb or Neon secret, not in the app source.
- The repo's original Render blueprint in [render.yaml](render.yaml) is still valid for Render, but it is not required for Koyeb/Neon.

The API currently uses TypeORM synchronization to create its initial schema (`DB_SYNCHRONIZE=true`). Turn this off after adopting explicit migrations for production schema changes.

## API

- `POST /api/submissions` stores a new website as pending.
- `GET /api/submissions` lists pending and in-review submissions.
- `POST /api/submissions/:id/votes/admin` records one admin vote.
- `POST /api/submissions/:id/votes/client` records one client vote after the admin stage reaches five votes.
- After five admin and three client votes, the API saves the website and exposes it through `GET /api/websites-saved`.
- `GET /api/nodes` lists registered cluster nodes.
- `POST /api/nodes/heartbeat` inserts or updates a node. Each node process must send `x-node-token: $NODE_REGISTRATION_TOKEN` and report its real ID, name, region, latency, and status.

No node records are seeded. The admin overview remains empty until actual node processes send heartbeats.

## Local API

Copy `backend/.env.example` to `backend/.env`, configure a local PostgreSQL connection, then run:

```powershell
npm --prefix backend run start:dev
```

For Neon local or remote testing, set `DATABASE_URL` to your Neon connection string and set `DB_SSL=true` if your connection requires SSL.

For local frontend development, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_API_URL=http://localhost:3000`.

## Koyeb deployment (backend) + Neon database

1. Create a Neon project and copy the PostgreSQL connection string.
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
```

5. Deploy the service and copy the generated public URL into Vercel as `VITE_API_URL`.

This setup matches the app’s current NestJS + TypeORM configuration in [backend/src/app.module.ts](backend/src/app.module.ts).

## Frontend routing and content

- `frontend/vercel.json` sends browser routes to `index.html`, allowing React Router routes such as `/discover` and `/admin/login` to load on refresh.
- In Render, set `CORS_ORIGIN` to the exact Vercel production origin, including `https://` and excluding any path. If both production and preview deployments need API access, provide a comma-separated list of exact origins.
- The database is not seeded with website records. Submit content and complete the configured review votes before it appears in the saved websites directory. Confirm the Render API is healthy and `GET /api/websites-saved` returns the expected records if the frontend loads but its directory is empty.

## Current limitation

The current frontend login is demo-only. The vote endpoint accepts numeric voter IDs and is not protected by production user authentication; replace demo login with server-validated auth and authorize voter roles before opening voting to the public.