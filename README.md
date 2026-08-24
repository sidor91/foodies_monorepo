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
   - Swagger API docs: http://localhost:4000/api/docs

Other useful commands:

```bash
make down     # stop all containers
make restart  # restart all containers
make logs     # follow container logs
make ps       # list running containers
make clean    # stop containers, remove volumes and prune images
```

## Database

The database is PostgreSQL, accessed through [Prisma ORM](https://www.prisma.io/). The schema (`backend/prisma/schema.prisma`) defines the following tables: `categories`, `areas`, `ingredients`, `users`, `follows`, `recipes`, `recipe_ingredients`, `favorites`, and `testimonials`.

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

`npm run db:seed` runs `backend/prisma/seed.ts`, which reads the CSV files in `backend/prisma/seed-data/` and populates the corresponding tables.

### Resetting the database

To wipe the database volume and start fresh:

```bash
make clean
make up
```

`make clean` removes the `postgres_data` Docker volume, so the next `make up` will run migrations and seeding again from scratch.

### Environment variables

Database connection settings are configured via environment variables (see `.env.example`):

| Variable            | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `POSTGRES_DB`       | Database name                                                   |
| `POSTGRES_USER`     | Database user                                                   |
| `POSTGRES_PASSWORD` | Database password                                               |
| `POSTGRES_PORT`     | Host port mapped to PostgreSQL (container port `5432`)          |
| `DATABASE_URL`      | Prisma connection string used by the backend/db-init containers |

## Backend Testing

Backend API integration tests use Vitest and Supertest against a separate PostgreSQL test database.

The tests require `TEST_DATABASE_URL` and include a safety check that refuses to run against a database whose name does not contain `test`. This prevents the integration tests from accidentally modifying the development database.

### Start the test database

The existing PostgreSQL Docker Compose service can be started as a separate Compose project with its own database and Docker volume.

#### Windows CMD

From the project root:

```cmd
set "POSTGRES_DB=foodies_test"
set "POSTGRES_USER=postgres"
set "POSTGRES_PASSWORD=postgres"
set "POSTGRES_PORT=5433"

docker compose -p foodies-test up -d postgres
```

Then from `backend`:

```cmd
set "TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/foodies_test"

cmd /C "set DATABASE_URL=%TEST_DATABASE_URL%&& npx prisma migrate deploy"
cmd /C "set DATABASE_URL=%TEST_DATABASE_URL%&& npx prisma db seed"

npm test
```

#### macOS / Linux

From the project root:

```bash
POSTGRES_DB=foodies_test \
POSTGRES_USER=postgres \
POSTGRES_PASSWORD=postgres \
POSTGRES_PORT=5433 \
docker compose -p foodies-test up -d postgres
```

Then from `backend`:

```bash
export TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5433/foodies_test"

DATABASE_URL="$TEST_DATABASE_URL" npx prisma migrate deploy
DATABASE_URL="$TEST_DATABASE_URL" npx prisma db seed

npm test
```

The integration suite covers system and reference endpoints, authentication, user profiles and follows, public and private recipe operations, favorites, pagination, filtering, validation, authorization, and logout behavior.

Test-created users, recipes, follows, and favorites are cleaned up by the suite after execution.

### Stop the test database

From the project root:

```bash
docker compose -p foodies-test down
```

To also remove the isolated test database volume:

```bash
docker compose -p foodies-test down -v
```

## API Documentation

Interactive Swagger/OpenAPI documentation for the backend REST API is available at `/api/docs`.

The raw OpenAPI specification is available at `/api/docs.json`.

The documentation is generated with `swagger-jsdoc` and served with `swagger-ui-express`. It includes request and response schemas, pagination and path parameters, error responses, and authentication schemes.

All routes are prefixed with `/api`. Private endpoints accept the access token either from the HTTP-only `accessToken` cookie or as a Bearer JWT.

### Public endpoints

| Method | Endpoint           | Description                                 |
| ------ | ------------------ | ------------------------------------------- |
| GET    | `/health`          | Health check                                |
| GET    | `/recipes`         | Search/list recipes (paginated, filterable by category/ingredient/area/userId) |
| GET    | `/recipes/popular` | Most favorited recipes                      |
| GET    | `/recipes/:id`     | Recipe details by id                        |
| GET    | `/categories`      | List all categories                         |
| GET    | `/areas`           | List all areas                              |
| GET    | `/ingredients`     | List all ingredients                        |
| GET    | `/testimonials`    | List all testimonials                       |

### Authentication endpoints

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register a new user            |
| POST   | `/auth/login`    | Log in and issue auth tokens   |
| POST   | `/auth/refresh`  | Refresh authentication tokens  |
| POST   | `/auth/logout`   | Log out the authenticated user |

### Authenticated endpoints (Auth)

| Method | Endpoint                | Description                           |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/users/me`             | Get current user profile              |
| PATCH  | `/users/me/avatar`      | Update current user avatar            |
| GET    | `/users/following`      | Get users followed by current user    |
| GET    | `/users/:id/followers`  | Get followers of a user               |
| POST   | `/users/:id/follow`     | Follow a user                         |
| DELETE | `/users/:id/follow`     | Unfollow a user                       |
| GET    | `/users/:id`            | Get another user's profile            |
| GET    | `/recipes/own`          | Recipes created by the current user   |
| GET    | `/recipes/favorites`    | Recipes favorited by the current user |
| POST   | `/recipes`              | Create a recipe                       |
| DELETE | `/recipes/:id`          | Delete own recipe                     |
| POST   | `/recipes/:id/favorite` | Add a recipe to favorites             |
| DELETE | `/recipes/:id/favorite` | Remove a recipe from favorites        |

> Note: user registration/login/JWT-issuing endpoints are not yet implemented — `authMiddleware` currently expects a token issued elsewhere.
