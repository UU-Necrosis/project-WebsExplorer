# Deployment

## Services

- Deploy `frontend/` as a Vercel project. Set the Vercel project Root Directory to `frontend`, Framework Preset to Vite, Build Command to `npm run build`, and Output Directory to `dist`.
- Set Vercel's `VITE_BASE_URL` to `/` and `VITE_API_URL` to the public Render API origin, for example `https://webs-explore-api.onrender.com`. Replace the example with the actual Render service URL shown in its dashboard. These variables are embedded at build time, so redeploy after changing them.
- Deploy the root Render Blueprint using `render.yaml`. It creates a NestJS web service and a PostgreSQL database. Set `CORS_ORIGIN` to the Vercel production origin.
- Keep `DATABASE_URL` private. Render injects it into the API from the managed database connection string.

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

For local frontend development, copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_API_URL=http://localhost:3000`.

## Frontend routing and content

- `frontend/vercel.json` sends browser routes to `index.html`, allowing React Router routes such as `/discover` and `/admin/login` to load on refresh.
- In Render, set `CORS_ORIGIN` to the exact Vercel production origin, including `https://` and excluding any path. If both production and preview deployments need API access, provide a comma-separated list of exact origins.
- The database is not seeded with website records. Submit content and complete the configured review votes before it appears in the saved websites directory. Confirm the Render API is healthy and `GET /api/websites-saved` returns the expected records if the frontend loads but its directory is empty.

## Current limitation

The current frontend login is demo-only. The vote endpoint accepts numeric voter IDs and is not protected by production user authentication; replace demo login with server-validated auth and authorize voter roles before opening voting to the public.