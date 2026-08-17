import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.get("/api/health", (req, res) => {
	res.json({ status: "ok" });
});

const port = process.env.BACK_PORT || 4000;
app.listen(port, () => {
	console.log(`Backend listening on port ${port}`);
});
