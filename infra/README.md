# infra: development database

In development **only the database runs in Docker**. The backend (`npm run start:dev`) and frontend
(`npm run dev`) run directly on your machine with hot reload. See
[backend/docs/decisions.md](../backend/docs/decisions.md) for why.

| Service | Container | Port | What it is |
| --- | --- | --- | --- |
| `postgres` | `pos-postgres` | `127.0.0.1:5433` (`DB_PORT`) | PostgreSQL 17, data in the `pos-system_pos_pgdata` volume |

It's bound to `127.0.0.1`, so it's reachable from this machine only, not from the LAN.
Credentials and the port come from **`backend/.env`** (`DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`),
the same file the backend reads, so they always match.

## Start and stop

Run these from `backend/`:

```bash
npm run db:up      # start Postgres and wait until it's healthy
npm run db:logs    # follow the logs (Ctrl+C to stop following)
npm run db:down    # stop and remove the container. The data volume is KEPT.
```

First time, or after `db:reset`, also run `npm run migration:run` and `npm run seed`.

`db:down` never deletes data. The next `db:up` starts with everything you had.

## Look at the data

Connect any SQL client (psql, DBeaver, TablePlus, the VS Code PostgreSQL extension) with host
`localhost`, port `5433`, and `DB_USER` / `DB_PASS` / `DB_NAME` from `backend/.env`. Or use psql
inside the container, which needs no install:

```bash
docker exec -it pos-postgres psql -U pos -d pos
\dt                      -- list tables
select * from users;
```

Tables are in schema `public`: `users`, `locations`, and `migrations` (TypeORM's history).

## Reset the database (on purpose)

```bash
cd backend
npm run db:reset
```

It asks you to **type the database name** to confirm. Then it drops and recreates the `public`
schema (all tables, data and migration history), runs `migration:run` and `seed`. Everyone has to
log in again. It refuses to run when `NODE_ENV=production`, when `DB_HOST` isn't local, or without
an interactive terminal. It doesn't touch the Docker volume.

To delete the data volume itself (rarely needed, e.g. to change `DB_USER`/`DB_PASS`):

```bash
npm run db:down
docker volume rm pos-system_pos_pgdata   # permanent: all data is gone
npm run db:up && npm run migration:run && npm run seed
```

## Common problems

**`Bind for 127.0.0.1:5433 failed: port is already allocated`**
Another program uses the port. See what it is:

```bash
lsof -nP -iTCP:5433 -sTCP:LISTEN
docker ps --format '{{.Names}}  {{.Ports}}'
```

Don't stop it unless it's yours. Pick another port in `backend/.env` instead (e.g. `DB_PORT=5434`),
then `npm run db:down && npm run db:up`. Nothing else needs to change, because the backend reads the
same variable.

**`container pos-postgres is unhealthy`, or the backend says `ECONNREFUSED 127.0.0.1:5433` right after starting**
Postgres needs a few seconds on first start (longer when it creates a new volume). `npm run db:up`
already waits for the healthcheck. If you started it another way, wait and check:

```bash
docker ps --filter name=pos-postgres   # STATUS must say (healthy)
npm run db:logs                        # look for "database system is ready to accept connections"
```

If it stays unhealthy, the logs say why. Common causes: Docker Desktop isn't running, the disk is
full, or the volume was created with a different `DB_USER`/`DB_PASS`. Postgres only applies those on the
**first** start of a volume, so changing them later means the old ones still apply. Change them back,
or delete the volume (see above).

**`password authentication failed for user "pos"`**
Same cause: `backend/.env` changed after the volume was created. Use the original credentials, or
delete the volume.

**`--env-file .env: no such file`**
Run the `db:*` scripts from `backend/`, and create `backend/.env` first (`cp .env.example .env`).
