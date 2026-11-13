# Deployment

## Services

- Deploy `frontend/` as a Vercel project. Set `VITE_API_URL` to the public Render API origin, for example `https://webs-explore-api.onrender.com`.
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

## Current limitation

The current frontend login is demo-only. The vote endpoint accepts numeric voter IDs and is not protected by production user authentication; replace demo login with server-validated auth and authorize voter roles before opening voting to the public.