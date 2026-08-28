import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { Express } from "express";
import type { PrismaClient } from "@prisma/client";

const TEST_EMAIL = "api.integration.test@foodies.local";
const TEST_PASSWORD = "testpass123";
const TEST_NAME = "API Integration Test";

let app: Express;
let prisma: PrismaClient;
let agent: ReturnType<typeof request.agent>;

let testUserId: string;
let seedUserId: string;
let seedRecipeId: string;
let categoryId: string;
let areaId: string;
let ingredientId: string;
let createdRecipeId: string;

async function cleanupTestUser() {
  const user = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
    select: { id: true },
  });

  if (!user) {
    return;
  }

  await prisma.favorite.deleteMany({
    where: { userId: user.id },
  });

  await prisma.follow.deleteMany({
    where: {
      OR: [{ followerId: user.id }, { followingId: user.id }],
    },
  });

  await prisma.recipe.deleteMany({
    where: { ownerId: user.id },
  });

  await prisma.user.delete({
    where: { id: user.id },
  });
}

beforeAll(async () => {
  const testDatabaseUrl = process.env.DATABASE_URL;

  if (!testDatabaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Tests will not run without an explicit test database.",
    );
  }

  const databaseName = new URL(testDatabaseUrl).pathname.replace(/^\/+/, "");

  if (!databaseName.toLowerCase().includes("test")) {
    throw new Error(
      `Refusing to run tests against database "${databaseName}". DATABASE_URL must point to a test database.`,
    );
  }

  process.env.NODE_ENV ??= "test";
  process.env.ACCESS_TOKEN_SECRET ??= "foodies-test-access-secret";
  process.env.REFRESH_TOKEN_SECRET ??= "foodies-test-refresh-secret";
  process.env.ACCESS_TOKEN_EXPIRES_IN ??= "15m";
  process.env.REFRESH_TOKEN_EXPIRES_IN ??= "30d";
  process.env.BCRYPT_ROUNDS ??= "4";

  const serverModule = await import("../src/server.js");
  const prismaModule = await import("../src/db/prisma.js");

  app = serverModule.app;
  prisma = prismaModule.prisma;
  agent = request.agent(app);

  await prisma.$connect();

  await cleanupTestUser();

  const seedRecipe = await prisma.recipe.findFirst({
    where: {
      ingredients: {
        some: {},
      },
    },
    include: {
      ingredients: {
        take: 1,
      },
    },
  });

  if (!seedRecipe || seedRecipe.ingredients.length === 0) {
    throw new Error(
      "Seeded recipe data is required. Run the test database seed before running the tests.",
    );
  }

  seedRecipeId = seedRecipe.id;
  seedUserId = seedRecipe.ownerId;
  categoryId = seedRecipe.categoryId;
  areaId = seedRecipe.areaId;
  ingredientId = seedRecipe.ingredients[0].ingredientId;
});

afterAll(async () => {
  if (prisma) {
    await cleanupTestUser();
    await prisma.$disconnect();
  }
});

describe("System", () => {
  it("GET /api/health returns backend health", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("GET /api/docs.json returns the OpenAPI specification", async () => {
    const response = await request(app).get("/api/docs.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.info).toHaveProperty("title", "Foodies API");
    expect(response.body.paths).toHaveProperty("/health");
    expect(response.body.paths).toHaveProperty("/auth/login");
    expect(response.body.paths).toHaveProperty("/users/me");
    expect(response.body.paths).toHaveProperty("/recipes");
  });

  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/api/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Not found" });
  });
});

describe("Reference endpoints", () => {
  it("GET /api/categories returns categories", async () => {
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
  });

  it("GET /api/areas returns areas", async () => {
    const response = await request(app).get("/api/areas");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /api/ingredients returns ingredients", async () => {
    const response = await request(app).get("/api/ingredients");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("GET /api/testimonials returns testimonials", async () => {
    const response = await request(app).get("/api/testimonials");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe("Authentication", () => {
  it("POST /api/auth/register rejects invalid registration data", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "",
      email: TEST_EMAIL,
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/auth/register creates a user", async () => {
    const response = await agent.post("/api/auth/register").send({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(TEST_NAME);
    expect(response.body.email).toBe(TEST_EMAIL);
    expect(response.body).not.toHaveProperty("passwordHash");
    expect(response.body).not.toHaveProperty("refreshTokenHash");

    testUserId = response.body.id;

    const cookies = response.headers["set-cookie"] as unknown as string[];

    expect(cookies.some((cookie) => cookie.startsWith("accessToken="))).toBe(true);
    expect(cookies.some((cookie) => cookie.startsWith("refreshToken="))).toBe(true);
  });

  it("POST /api/auth/register rejects duplicate email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: TEST_NAME,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/auth/login rejects invalid credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/auth/login rejects missing credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/auth/login logs in the test user", async () => {
    const response = await agent.post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.email).toBe(TEST_EMAIL);
  });

  it("accepts an access token through the Authorization Bearer header", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(loginResponse.status).toBe(200);

    const cookies = loginResponse.headers["set-cookie"] as unknown as string[];
    const accessTokenCookie = cookies.find((cookie) => cookie.startsWith("accessToken="));

    expect(accessTokenCookie).toBeDefined();

    const accessToken = accessTokenCookie!.split(";")[0].slice("accessToken=".length);

    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.email).toBe(TEST_EMAIL);
  });

  it("POST /api/auth/refresh refreshes authentication cookies", async () => {
    const response = await agent.post("/api/auth/refresh");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testUserId);

    const cookies = response.headers["set-cookie"] as unknown as string[];

    expect(cookies.some((cookie) => cookie.startsWith("accessToken="))).toBe(true);
    expect(cookies.some((cookie) => cookie.startsWith("refreshToken="))).toBe(true);
  });

  it("POST /api/auth/refresh rejects a request without refresh token", async () => {
    const response = await request(app).post("/api/auth/refresh");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});

describe("Users", () => {
  it("GET /api/users/me rejects unauthenticated requests", async () => {
    const response = await request(app).get("/api/users/me");

    expect(response.status).toBe(401);
  });

  it("GET /api/users/me returns current user profile", async () => {
    const response = await agent.get("/api/users/me");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.email).toBe(TEST_EMAIL);
    expect(response.body).toHaveProperty("recipesCount");
    expect(response.body).toHaveProperty("followersCount");
    expect(response.body).toHaveProperty("favoritesCount");
    expect(response.body).toHaveProperty("followingCount");
  });

  it("GET /api/users/:id returns another user's profile", async () => {
    const response = await agent.get(`/api/users/${seedUserId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedUserId);
    expect(response.body).toHaveProperty("recipesCount");
    expect(response.body).toHaveProperty("followersCount");
    expect(response.body).not.toHaveProperty("favoritesCount");
    expect(response.body).not.toHaveProperty("followingCount");
  });

  it("GET /api/users/:id returns 404 for unknown user", async () => {
    const response = await agent.get("/api/users/user-that-does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "User not found" });
  });

  it("POST /api/users/:id/follow follows another user", async () => {
    const response = await agent.post(`/api/users/${seedUserId}/follow`);

    expect(response.status).toBe(204);
  });

  it("POST /api/users/:id/follow is idempotent", async () => {
    const response = await agent.post(`/api/users/${seedUserId}/follow`);

    expect(response.status).toBe(204);
  });

  it("GET /api/users/following returns followed users", async () => {
    const response = await agent.get("/api/users/following");

    expect(response.status).toBe(200);
    expect(response.body.items.some((user: { id: string }) => user.id === seedUserId)).toBe(true);

    for (const user of response.body.items) {
      expect(Array.isArray(user.recipes)).toBe(true);
      expect(user.recipes.length).toBeLessThanOrEqual(4);

      for (const recipe of user.recipes) {
        expect(recipe).toHaveProperty("id");
        expect(recipe).toHaveProperty("title");
        expect(recipe).toHaveProperty("image");
      }
    }

    expect(response.body.page).toBe(1);
    expect(response.body).toHaveProperty("total");
    expect(response.body).toHaveProperty("totalPages");
  });

  it("GET /api/users/:id/followers returns followers", async () => {
    const response = await agent.get(`/api/users/${seedUserId}/followers`);

    expect(response.status).toBe(200);
    expect(response.body.items.some((user: { id: string }) => user.id === testUserId)).toBe(true);

    for (const user of response.body.items) {
      expect(Array.isArray(user.recipes)).toBe(true);
      expect(user.recipes.length).toBeLessThanOrEqual(4);

      for (const recipe of user.recipes) {
        expect(recipe).toHaveProperty("id");
        expect(recipe).toHaveProperty("title");
        expect(recipe).toHaveProperty("image");
      }
    }
  });

  it("POST /api/users/:id/follow rejects following yourself", async () => {
    const response = await agent.post(`/api/users/${testUserId}/follow`);

    expect(response.status).toBe(400);
  });

  it("POST /api/users/:id/follow returns 404 for unknown user", async () => {
    const response = await agent.post("/api/users/user-that-does-not-exist/follow");

    expect(response.status).toBe(404);
  });

  it("DELETE /api/users/:id/follow unfollows another user", async () => {
    const response = await agent.delete(`/api/users/${seedUserId}/follow`);

    expect(response.status).toBe(204);
  });

  it("PATCH /api/users/me/avatar rejects request without a file", async () => {
    const response = await agent.patch("/api/users/me/avatar");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "avatar file is required" });
  });

  it("PATCH /api/users/me/avatar rejects unsupported file type", async () => {
    const response = await agent
      .patch("/api/users/me/avatar")
      .attach("avatar", Buffer.from("not an image"), {
        filename: "avatar.txt",
        contentType: "text/plain",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});

describe("Public recipes", () => {
  it("GET /api/recipes returns paginated recipes", async () => {
    const response = await request(app).get("/api/recipes").query({
      page: 1,
      limit: 2,
    });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(2);
    expect(response.body.items.length).toBeLessThanOrEqual(2);
    expect(response.body.total).toBeGreaterThan(0);
    expect(response.body.totalPages).toBeGreaterThan(0);

    for (const recipe of response.body.items) {
      expect(recipe.owner).toHaveProperty("id");
      expect(recipe.owner).toHaveProperty("name");
      expect(recipe.owner).toHaveProperty("avatarUrl");
    }
  });

  it("GET /api/recipes applies category, area and ingredient filters", async () => {
    const response = await request(app).get("/api/recipes").query({
      category: categoryId,
      area: areaId,
      ingredient: ingredientId,
    });

    expect(response.status).toBe(200);
    expect(response.body.total).toBeGreaterThan(0);

    for (const recipe of response.body.items) {
      expect(recipe.category.id).toBe(categoryId);
      expect(recipe.area.id).toBe(areaId);
    }
  });

  it("GET /api/recipes enforces pagination boundaries", async () => {
    const response = await request(app).get("/api/recipes").query({
      page: -10,
      limit: 500,
    });

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(50);
  });

  it("GET /api/recipes/popular returns popular recipes", async () => {
    const response = await request(app).get("/api/recipes/popular").query({
      limit: 3,
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(3);

    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty("favoritesCount");
    }
  });

  it("GET /api/recipes/:id returns recipe details", async () => {
    const response = await request(app).get(`/api/recipes/${seedRecipeId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(seedRecipeId);
    expect(response.body).toHaveProperty("ingredients");
    expect(response.body).toHaveProperty("owner");
    expect(response.body).toHaveProperty("category");
    expect(response.body).toHaveProperty("area");
  });

  it("GET /api/recipes/:id returns 404 for unknown recipe", async () => {
    const response = await request(app).get("/api/recipes/recipe-that-does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Recipe not found" });
  });
});

describe("Private recipes", () => {
  it("GET /api/recipes/own rejects unauthenticated requests", async () => {
    const response = await request(app).get("/api/recipes/own");

    expect(response.status).toBe(401);
  });

  it("POST /api/recipes rejects unauthenticated requests", async () => {
    const response = await request(app).post("/api/recipes").send({
      title: "Unauthorized recipe",
    });

    expect(response.status).toBe(401);
  });

  it("POST /api/recipes validates required fields", async () => {
    const response = await agent.post("/api/recipes").field("title", "Incomplete recipe");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/recipes validates ingredients JSON", async () => {
    const response = await agent
      .post("/api/recipes")
      .field("title", "Invalid Ingredients")
      .field("instructions", "Test instructions")
      .field("categoryId", categoryId)
      .field("areaId", areaId)
      .field("ingredients", "not-valid-json");

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Invalid request data");
  });

  it("POST /api/recipes creates an authenticated user's recipe", async () => {
    const response = await agent
      .post("/api/recipes")
      .field("title", "Integration Test Recipe")
      .field("instructions", "Prepare this recipe during the integration test.")
      .field("description", "Created automatically by the backend API test.")
      .field("time", "25")
      .field("categoryId", categoryId)
      .field("areaId", areaId)
      .field(
        "ingredients",
        JSON.stringify([
          {
            ingredientId,
            measure: "1 cup",
          },
        ]),
      );

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Integration Test Recipe");
    expect(response.body.ownerId).toBe(testUserId);
    expect(response.body.categoryId).toBe(categoryId);
    expect(response.body.areaId).toBe(areaId);
    expect(response.body.ingredients.length).toBe(1);

    createdRecipeId = response.body.id;
  });

  it("GET /api/recipes/own returns the created recipe", async () => {
    const response = await agent.get("/api/recipes/own");

    expect(response.status).toBe(200);
    expect(
      response.body.items.some((recipe: { id: string }) => recipe.id === createdRecipeId),
    ).toBe(true);
  });

  it("GET /api/recipes filters by userId", async () => {
    const response = await request(app).get("/api/recipes").query({ userId: testUserId });

    expect(response.status).toBe(200);
    expect(
      response.body.items.some((recipe: { id: string }) => recipe.id === createdRecipeId),
    ).toBe(true);
    expect(response.body.items.some((recipe: { id: string }) => recipe.id === seedRecipeId)).toBe(
      false,
    );
  });

  it("DELETE /api/recipes/:id prevents deleting another user's recipe", async () => {
    const response = await agent.delete(`/api/recipes/${seedRecipeId}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /api/recipes/:id/favorite adds a recipe to favorites", async () => {
    const response = await agent.post(`/api/recipes/${seedRecipeId}/favorite`);

    expect(response.status).toBe(204);
  });

  it("POST /api/recipes/:id/favorite is idempotent", async () => {
    const response = await agent.post(`/api/recipes/${seedRecipeId}/favorite`);

    expect(response.status).toBe(204);
  });

  it("GET /api/recipes/favorites returns favorite recipes", async () => {
    const response = await agent.get("/api/recipes/favorites");

    expect(response.status).toBe(200);
    expect(response.body.items.some((recipe: { id: string }) => recipe.id === seedRecipeId)).toBe(
      true,
    );
  });

  it("POST /api/recipes/:id/favorite returns 404 for unknown recipe", async () => {
    const response = await agent.post("/api/recipes/recipe-that-does-not-exist/favorite");

    expect(response.status).toBe(404);
  });

  it("DELETE /api/recipes/:id/favorite removes a favorite", async () => {
    const response = await agent.delete(`/api/recipes/${seedRecipeId}/favorite`);

    expect(response.status).toBe(204);

    const favoritesResponse = await agent.get("/api/recipes/favorites");

    expect(
      favoritesResponse.body.items.some((recipe: { id: string }) => recipe.id === seedRecipeId),
    ).toBe(false);
  });

  it("DELETE /api/recipes/:id/favorite is idempotent for an unknown recipe", async () => {
    const response = await agent.delete("/api/recipes/recipe-that-does-not-exist/favorite");

    expect(response.status).toBe(204);
  });

  it("DELETE /api/recipes/:id returns 404 for unknown recipe", async () => {
    const response = await agent.delete("/api/recipes/recipe-that-does-not-exist");

    expect(response.status).toBe(404);
  });

  it("DELETE /api/recipes/:id deletes the user's own recipe", async () => {
    const response = await agent.delete(`/api/recipes/${createdRecipeId}`);

    expect(response.status).toBe(204);

    const getResponse = await request(app).get(`/api/recipes/${createdRecipeId}`);

    expect(getResponse.status).toBe(404);

    createdRecipeId = "";
  });
});

describe("Logout", () => {
  it("POST /api/auth/logout logs out the authenticated user", async () => {
    const response = await agent.post("/api/auth/logout");

    expect(response.status).toBe(204);
  });

  it("private endpoints are unavailable after logout", async () => {
    const response = await agent.get("/api/users/me");

    expect(response.status).toBe(401);
  });

  it("refresh is unavailable after logout", async () => {
    const response = await agent.post("/api/auth/refresh");

    expect(response.status).toBe(401);
  });
});
