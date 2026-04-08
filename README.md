# 3-tier architecture for clowns

This codebase is now organized so each top-level tier can be copied into its own Git repository and deployed on its own VM without dragging the other tiers along.

## Repo-ready tiers

- `frontend/`: static UI served by Nginx and proxying `/api` to the backend VM
- `backend/`: small Node.js API for incident creation and retrieval
- `db/`: MySQL schema and database container setup

Each folder now includes its own:

- `README.md`
- `docker-compose.yml`
- `.env.example` when configuration is needed
- only the files that belong to that tier

## Suggested VM mapping

- Frontend VM: `10.0.2.50`
- Backend VM: `10.0.3.50`
- DB VM: `10.0.4.50`

## Quick deployment flow

1. Copy `db/` to the database VM, create `.env` from `.env.example`, then run `docker compose up -d`.
2. Copy `backend/` to the backend VM, create `.env`, then run `docker compose up -d --build`.
3. Copy `frontend/` to the frontend VM, create `.env`, then run `docker compose up -d --build`.

## Network rules

- Allow clients to reach only the frontend VM on port `80`
- Allow the frontend VM to reach the backend VM on port `3000`
- Allow the backend VM to reach the DB VM on port `3306`
- Deny public access to the backend and DB ports

## Notes

- The backend now exposes `GET /api/health` for a quick API-to-DB check.
- The frontend was refreshed with a cleaner dashboard-style layout while staying plain HTML, CSS, and JavaScript.
