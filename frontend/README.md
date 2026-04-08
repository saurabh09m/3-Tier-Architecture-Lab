# Frontend tier

This folder is ready to live as its own repository on the frontend VM.

## Stack

- Static HTML, CSS, and JavaScript
- Nginx for serving assets and proxying `/api/` to the backend VM

## Files to keep in the frontend repo

- `index.html`
- `app.js`
- `css/`
- `images/`
- `Dockerfile`
- `default.conf.template`
- `docker-compose.yml`

## Run on the frontend VM

1. Copy `.env.example` to `.env`
2. Set `BACKEND_HOST` to the backend VM IP
3. Start the service:

```bash
docker compose up -d --build
```

The site will be available on port `80`.
