import "dotenv/config";
import express from "express";
import cors from "cors";
import ingestRouter from "./src/routes/ingest.js";
import chatRouter from "./src/routes/chat.js";
import statsRouter from "./src/routes/stats.js";

const app = express();

// Only allow your deployed frontend in production.
// Locally (no FRONTEND_URL set), any origin is allowed.
const allowedOrigin = process.env.FRONTEND_URL;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : undefined));

app.use(express.json({ limit: "5mb" })); // raise if ingesting large docs

app.use("/api/chat", chatRouter);

// Ingest and stats-load routes write to your database, so they are
// off by default. Set ENABLE_ADMIN_ROUTES=true in your LOCAL .env only
// when you need to run the Python ingest scripts. Never set it on Vercel.
if (process.env.ENABLE_ADMIN_ROUTES === "true") {
  app.use("/api/ingest", ingestRouter);
  app.use("/api/stats", statsRouter);
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Vercel runs the app as a serverless function, so it must not call listen().
// Locally, start the server as before.
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;