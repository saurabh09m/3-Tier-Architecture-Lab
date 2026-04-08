# Backend tier

This folder is ready to become its own repository on the backend VM.

## Stack

- Node.js
- Express
- MySQL via `mysql2`

## API routes

- `GET /api/health`
- `GET /api/incidents`
- `POST /api/incidents`

## Run on the backend VM

1. Copy `.env.example` to `.env`
2. Set `DB_HOST` to the database VM IP
3. Start the service:

```bash
docker compose up -d --build
```

The API listens on port `3000` by default.
