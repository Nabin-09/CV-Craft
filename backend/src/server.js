import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cvRoutes from "./routes/cv.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/cv", cvRoutes);

app.get("/", (req, res) => {
  res.send("cv-craft backend running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`cv-craft backend running on port ${PORT}`);
});
