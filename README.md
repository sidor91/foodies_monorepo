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

Tests are configured through `backend/.env.test`, where `DATABASE_URL` must point to a test database. The test suite includes a safety check and refuses to run if the database name does not contain `test`.

Before the first test run, create the test environment file from the example.

### Windows CMD

From the project root:

```cmd
copy backend\.env.test.example backend\.env.test
```

### macOS / Linux

From the project root:

```bash
cp backend/.env.test.example backend/.env.test
```

Update `backend/.env.test` if needed so that it matches the PostgreSQL credentials and port used by the test database.

Example:

```env
NODE_ENV=test

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/foodies_test

ACCESS_TOKEN_SECRET=foodies-test-access-secret
REFRESH_TOKEN_SECRET=foodies-test-refresh-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=30d

BCRYPT_ROUNDS=4
```

### Start the test database

The PostgreSQL Docker Compose service can be started as a separate Compose project with its own container and volume.

From the project root:

```bash
docker compose -p foodies-test up -d postgres
```

Check that the database container is healthy:

```bash
docker compose -p foodies-test ps
```

If the container was created with the regular development database name, create the dedicated test database inside it:

```bash
docker exec foodies-test-postgres-1 createdb -U postgres foodies_test
```

Make sure `backend/.env.test` points to that database.

For example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/foodies_test
```

### Run the tests

From the `backend` directory:

```bash
cd backend
npm test
```

`npm test`:

1. Applies pending Prisma migrations to the test database.
2. Seeds the test database.
3. Runs the Vitest integration test suite.

If the Prisma schema has changed, regenerate the Prisma client before running the tests:

```bash
npx prisma generate
```

The current integration suite contains **54 tests** covering:

- system and health endpoints
- Swagger/OpenAPI specification availability
- categories, areas, ingredients, and testimonials
- registration, login, refresh, and logout
- cookie and Bearer token authentication
- current and public user profiles
- follow and unfollow behavior
- followers and following lists
- avatar upload validation
- public and private recipe endpoints
- pagination and filtering
- recipe creation and deletion
- authorization and ownership checks
- favorites
- validation and error responses
- unknown resources and unauthorized requests

A successful run should finish with output similar to:

```text
Test Files  1 passed (1)
Tests       54 passed (54)
```

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

| Method | Endpoint           | Description                                                                    |
| ------ | ------------------ | ------------------------------------------------------------------------------ |
| GET    | `/health`          | Health check                                                                   |
| GET    | `/recipes`         | Search/list recipes (paginated, filterable by category/ingredient/area/userId) |
| GET    | `/recipes/popular` | Most favorited recipes                                                         |
| GET    | `/recipes/:id`     | Recipe details by id                                                           |
| GET    | `/categories`      | List all categories                                                            |
| GET    | `/areas`           | List all areas                                                                 |
| GET    | `/ingredients`     | List all ingredients                                                           |
| GET    | `/testimonials`    | List all testimonials                                                          |

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
