import express from "express";
import cors from "cors";
import recipesRouter from "./routes/recipes.routes.js";
import {
    categoriesRouter,
    areasRouter,
    ingredientsRouter,
    testimonialsRouter,
} from "./routes/references.routes.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/recipes", recipesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/areas", areasRouter);
app.use("/api/ingredients", ingredientsRouter);
app.use("/api/testimonials", testimonialsRouter);

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

const port = process.env.BACK_PORT || 4000;
app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
