# project-react-nodejs

Foodies — a full-stack recipe application (React frontend + Express/Prisma backend + PostgreSQL).

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- `make` (optional, wraps the Docker Compose commands)

## Getting Started

1. Copy the example environment file and adjust values if needed:

   ```bash
   cp .env.example .env
   ```

2. Build and start all services (PostgreSQL, backend, frontend):

   ```bash
   make up
   ```

   This is equivalent to `docker compose up --build -d`.

3. The app will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api
   - Swagger API docs: http://localhost:4000/api/docs _(planned — not yet implemented)_

Other useful commands:

```bash
make down     # stop all containers
make restart  # restart all containers
make logs     # follow container logs
make ps       # list running containers
make clean    # stop containers, remove volumes and prune images
```

## Database

The database is PostgreSQL, accessed through [Prisma ORM](https://www.prisma.io/). The schema (`backend/prisma/schema.prisma`) defines the following tables: `categories`, `areas`, `ingredients`, `users`, `recipes`, `recipe_ingredients`, and `testimonials`.

### Automatic setup (recommended)

When you run `make up` (or `docker compose up --build`), a dedicated `db-init` service runs automatically before the backend starts. It:

1. Applies all pending Prisma migrations (`prisma migrate deploy`).
2. Seeds the database with the starter dataset from `backend/prisma/seed-data/*.csv` (`prisma db seed`).

No manual steps are required — once the containers are up, the database already contains the initial categories, areas, ingredients, users, recipes and testimonials.

### Manual migration / seeding

If you need to (re-)run these steps manually, e.g. against a locally running backend container or a local PostgreSQL instance:

```bash
cd backend

# apply migrations
npx prisma migrate deploy

# seed the database with starter data
npm run db:seed
```

`npm run db:seed` runs `backend/prisma/seed.js`, which reads the CSV files in `backend/prisma/seed-data/` and populates the corresponding tables.

### Resetting the database

To wipe the database volume and start fresh:

```bash
make clean
make up
```

`make clean` removes the `postgres_data` Docker volume, so the next `make up` will run migrations and seeding again from scratch.

### Environment variables

Database connection settings are configured via environment variables (see `.env.example`):

| Variable            | Description                                             |
| -------------------- | -------------------------------------------------------- |
| `POSTGRES_DB`         | Database name                                            |
| `POSTGRES_USER`       | Database user                                            |
| `POSTGRES_PASSWORD`   | Database password                                        |
| `POSTGRES_PORT`       | Host port mapped to PostgreSQL (container port `5432`)   |
| `DATABASE_URL`        | Prisma connection string used by the backend/db-init containers |

## API Documentation

Interactive Swagger/OpenAPI documentation for the backend REST API is planned but not yet implemented. Once added, it will be served at `/api/docs` and generated from route/controller annotations (e.g. via `swagger-jsdoc` + `swagger-ui-express`).

All routes are prefixed with `/api`. Endpoints marked **Auth** require a valid JWT (`authMiddleware.authenticate`).

### Public endpoints

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------- |
| GET    | `/health`          | Health check                    |
| GET    | `/recipes`         | Search/list recipes (paginated, filterable) |
| GET    | `/recipes/popular` | Most favorited recipes          |
| GET    | `/recipes/:id`     | Recipe details by id            |
| GET    | `/categories`      | List all categories             |
| GET    | `/areas`           | List all areas                  |
| GET    | `/ingredients`     | List all ingredients            |
| GET    | `/testimonials`    | List all testimonials           |

### Authenticated endpoints (Auth)

| Method | Endpoint                | Description                          |
| ------ | ------------------------ | ------------------------------------- |
| GET    | `/recipes/own`           | Recipes created by the current user  |
| GET    | `/recipes/favorites`     | Recipes favorited by the current user |
| POST   | `/recipes`                | Create a recipe                      |
| DELETE | `/recipes/:id`            | Delete own recipe                    |
| POST   | `/recipes/:id/favorite`   | Add a recipe to favorites            |
| DELETE | `/recipes/:id/favorite`   | Remove a recipe from favorites       |

> Note: user registration/login/JWT-issuing endpoints are not yet implemented — `authMiddleware` currently expects a token issued elsewhere.
