import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import usersRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
import recipesRouter from "./routes/recipes.routes.js";
import {
  categoriesRouter,
  areasRouter,
  ingredientsRouter,
  testimonialsRouter,
} from "./routes/references.routes.js";
import { swaggerSpec } from "./swagger.js";
import { AppError } from "./utils/AppError.js";
import { prisma } from "./db/prisma.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/", (_, res) => {
  res.json({ message: "Foodies API" });
});

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - System
 *     summary: Check backend health
 *     description: Returns a simple response when the backend process is running.
 *     responses:
 *       200:
 *         description: Backend is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

app.get("/api/docs.json", (_, res) => {
  res.json(swaggerSpec);
});
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  }),
);

app.use("/api/recipes", recipesRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/areas", areasRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/testimonials", testimonialsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use(
  (err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: "Internal server error" });
  },
);

const port = process.env.BACK_PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  start();
}
