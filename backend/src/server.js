import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cvRoutes from "./routes/cv.routes.js";
import { cleanupOldFiles } from "./services/cleanup.service.js";
setInterval(cleanupOldFiles, 1000 * 60 * 10); // every 10 mins

import rateLimit from "express-rate-limit";




dotenv.config();

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
});

app.use("/api/", limiter);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api/cv", cvRoutes);

app.get("/", (req, res) => {
  res.send("cv-craft backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`cv-craft backend running on port ${PORT}`);
});
