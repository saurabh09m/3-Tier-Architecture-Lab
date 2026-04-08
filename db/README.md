# Database tier

This folder is ready to become its own repository on the database VM.

## Stack

- MySQL 8
- `init.sql` for schema and application user creation

## Default application credentials

- database: `clowndb`
- user: `appuser`
- password: `apppass`

## Run on the database VM

1. Copy `.env.example` to `.env`
2. Set a strong `MYSQL_ROOT_PASSWORD`
3. Start the service:

```bash
docker compose up -d
```

If you reuse an existing MySQL volume, `init.sql` will not be re-applied automatically.
