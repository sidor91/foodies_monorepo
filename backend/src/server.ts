import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.routes.js";
import authRouter from "./routes/auth.routes.js";
import recipesRouter from "./routes/recipes.routes.js";
import {
  categoriesRouter,
  areasRouter,
  ingredientsRouter,
  testimonialsRouter,
} from "./routes/references.routes.js";
import { AppError } from "./utils/AppError.js";
import { prisma } from "./db/prisma.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/", (_, res) => {
  res.json({ message: "Foodies API" });
});

app.get("/api/health", (_, res) => {
  res.json({ status: "ok" });
});

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

start();
