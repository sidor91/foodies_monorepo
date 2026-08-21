import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "node:url";

const sourceDir = fileURLToPath(new URL(".", import.meta.url)).replace(/\\/g, "/");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Foodies API",
      version: "1.0.0",
      description:
        "Interactive OpenAPI documentation for the Foodies backend. Private endpoints accept the access token either from the accessToken cookie or as a Bearer JWT.",
    },
    servers: [{ url: "/api", description: "Current Foodies API" }],
    tags: [
      { name: "System", description: "Service status endpoints" },
      { name: "Auth", description: "Registration, login, token refresh, and logout" },
      { name: "Users", description: "User profiles, avatars, followers, and following" },
      { name: "Recipes", description: "Recipe search, details, ownership, and favorites" },
      { name: "Categories", description: "Recipe category reference data" },
      { name: "Areas", description: "Dish origin area reference data" },
      { name: "Ingredients", description: "Ingredient reference data" },
      { name: "Testimonials", description: "User testimonial reference data" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Access token passed as Authorization: Bearer <token>.",
        },
        accessTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "HTTP-only access-token cookie set by register/login/refresh.",
        },
        refreshTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "HTTP-only refresh-token cookie set by register/login/refresh.",
        },
      },
      parameters: {
        Page: {
          name: "page",
          in: "query",
          description: "Page number.",
          schema: { type: "integer", minimum: 1, default: 1 },
        },
        Limit: {
          name: "limit",
          in: "query",
          description: "Items per page. Values above 50 are capped at 50.",
          schema: { type: "integer", minimum: 1, maximum: 50, default: 12 },
        },
        PopularLimit: {
          name: "limit",
          in: "query",
          description: "Maximum number of popular recipes to return.",
          schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
        },
        RecipeId: {
          name: "id",
          in: "path",
          required: true,
          description: "Recipe id.",
          schema: { type: "string" },
        },
        UserId: {
          name: "id",
          in: "path",
          required: true,
          description: "User id.",
          schema: { type: "string" },
        },
      },
      requestBodies: {
        RegisterUser: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Jane Doe" },
                  email: { type: "string", format: "email", example: "jane@example.com" },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 6,
                    example: "secret123",
                  },
                },
              },
            },
          },
        },
        LoginUser: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "jane@example.com" },
                  password: { type: "string", format: "password", example: "secret123" },
                },
              },
            },
          },
        },
        AvatarUpload: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["avatar"],
                properties: {
                  avatar: {
                    type: "string",
                    format: "binary",
                    description: "JPEG, PNG, or WebP image, maximum 2 MB.",
                  },
                },
              },
            },
          },
        },
        CreateRecipe: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/CreateRecipeInput" },
            },
          },
        },
      },
      schemas: {
        Error: {
          type: "object",
          required: ["message"],
          properties: {
            message: { type: "string", example: "Not found" },
          },
        },
        HealthResponse: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", example: "ok" },
          },
        },
        AuthUser: {
          type: "object",
          required: ["id", "name", "email", "avatarUrl"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            avatarUrl: { type: "string", format: "uri", nullable: true },
          },
        },
        CurrentUserProfile: {
          allOf: [
            { $ref: "#/components/schemas/AuthUser" },
            {
              type: "object",
              required: ["recipesCount", "followersCount", "favoritesCount", "followingCount"],
              properties: {
                recipesCount: { type: "integer", minimum: 0 },
                followersCount: { type: "integer", minimum: 0 },
                favoritesCount: { type: "integer", minimum: 0 },
                followingCount: { type: "integer", minimum: 0 },
              },
            },
          ],
        },
        PublicUserProfile: {
          allOf: [
            { $ref: "#/components/schemas/AuthUser" },
            {
              type: "object",
              required: ["recipesCount", "followersCount"],
              properties: {
                recipesCount: { type: "integer", minimum: 0 },
                followersCount: { type: "integer", minimum: 0 },
              },
            },
          ],
        },
        UserConnectionItem: {
          allOf: [{ $ref: "#/components/schemas/PublicUserProfile" }],
        },
        PaginatedUserConnections: {
          type: "object",
          required: ["items", "page", "limit", "total", "totalPages"],
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/UserConnectionItem" },
            },
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50 },
            total: { type: "integer", minimum: 0 },
            totalPages: { type: "integer", minimum: 0 },
          },
        },
        AvatarUpdateResponse: {
          type: "object",
          required: ["avatarUrl"],
          properties: {
            avatarUrl: { type: "string", format: "uri" },
          },
        },
        Category: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        Area: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
        Ingredient: {
          type: "object",
          required: ["id", "name", "description", "img"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            img: { type: "string", format: "uri", nullable: true },
          },
        },
        TestimonialOwner: {
          type: "object",
          required: ["id", "name", "avatarUrl"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            avatarUrl: { type: "string", format: "uri", nullable: true },
          },
        },
        Testimonial: {
          type: "object",
          required: ["id", "testimonial", "owner"],
          properties: {
            id: { type: "string" },
            testimonial: { type: "string" },
            owner: { $ref: "#/components/schemas/TestimonialOwner" },
          },
        },
        RecipeListItem: {
          type: "object",
          required: ["id", "title", "image", "description", "time", "category", "area"],
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            image: { type: "string", format: "uri", nullable: true },
            description: { type: "string", nullable: true },
            time: { type: "integer", nullable: true },
            category: { $ref: "#/components/schemas/Category" },
            area: { $ref: "#/components/schemas/Area" },
          },
        },
        PopularRecipe: {
          allOf: [
            { $ref: "#/components/schemas/RecipeListItem" },
            {
              type: "object",
              required: ["favoritesCount"],
              properties: {
                favoritesCount: { type: "integer", minimum: 0 },
              },
            },
          ],
        },
        RecipeOwner: {
          type: "object",
          required: ["id", "name", "avatarUrl"],
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            avatarUrl: { type: "string", format: "uri", nullable: true },
          },
        },
        RecipeIngredientInput: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string", description: "Ingredient id." },
            measure: { type: "string", nullable: true, example: "2 tbsp" },
          },
        },
        RecipeIngredient: {
          type: "object",
          required: ["recipeId", "ingredientId", "measure", "ingredient"],
          properties: {
            recipeId: { type: "string" },
            ingredientId: { type: "string" },
            measure: { type: "string", nullable: true },
            ingredient: { $ref: "#/components/schemas/Ingredient" },
          },
        },
        CreatedRecipeIngredient: {
          type: "object",
          required: ["recipeId", "ingredientId", "measure"],
          properties: {
            recipeId: { type: "string" },
            ingredientId: { type: "string" },
            measure: { type: "string", nullable: true },
          },
        },
        RecipeDetail: {
          type: "object",
          required: [
            "id",
            "title",
            "instructions",
            "description",
            "image",
            "time",
            "categoryId",
            "areaId",
            "ownerId",
            "category",
            "area",
            "owner",
            "ingredients",
          ],
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            instructions: { type: "string" },
            description: { type: "string", nullable: true },
            image: { type: "string", format: "uri", nullable: true },
            time: { type: "integer", nullable: true },
            categoryId: { type: "string" },
            areaId: { type: "string" },
            ownerId: { type: "string" },
            category: { $ref: "#/components/schemas/Category" },
            area: { $ref: "#/components/schemas/Area" },
            owner: { $ref: "#/components/schemas/RecipeOwner" },
            ingredients: {
              type: "array",
              items: { $ref: "#/components/schemas/RecipeIngredient" },
            },
          },
        },
        CreateRecipeInput: {
          type: "object",
          required: ["title", "instructions", "categoryId", "areaId"],
          properties: {
            title: { type: "string" },
            instructions: { type: "string" },
            description: { type: "string" },
            image: {
              type: "string",
              format: "binary",
              description: "Optional JPEG, PNG, or WebP cover image, maximum 2 MB.",
            },
            time: { type: "integer", minimum: 0 },
            categoryId: { type: "string" },
            areaId: { type: "string" },
            ingredients: {
              type: "string",
              description: "JSON-encoded array of RecipeIngredientInput items.",
              default: "[]",
            },
          },
        },
        CreatedRecipe: {
          type: "object",
          required: [
            "id",
            "title",
            "instructions",
            "description",
            "image",
            "time",
            "categoryId",
            "areaId",
            "ownerId",
            "ingredients",
          ],
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            instructions: { type: "string" },
            description: { type: "string", nullable: true },
            image: { type: "string", format: "uri", nullable: true },
            time: { type: "integer", nullable: true },
            categoryId: { type: "string" },
            areaId: { type: "string" },
            ownerId: { type: "string" },
            ingredients: {
              type: "array",
              items: { $ref: "#/components/schemas/CreatedRecipeIngredient" },
            },
          },
        },
        PaginatedRecipes: {
          type: "object",
          required: ["items", "page", "limit", "total", "totalPages"],
          properties: {
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/RecipeListItem" },
            },
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1, maximum: 50 },
            total: { type: "integer", minimum: 0 },
            totalPages: { type: "integer", minimum: 0 },
          },
        },
      },
    },
  },
  apis: [`${sourceDir}routes/*.{ts,js}`, `${sourceDir}server.{ts,js}`],
};

export const swaggerSpec = swaggerJsdoc(options);
