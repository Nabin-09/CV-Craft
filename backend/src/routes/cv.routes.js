import express from "express";
import { generateCV } from "../services/groq.service.js";
import { compileLatex } from "../services/latex.service.js";
import path from "path";

const router = express.Router();

const cvStore = new Map(); // in-memory (OK for now)

router.post("/generate", async (req, res) => {
  try {
    const { resume, jobDescription, additionalInfo } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Missing input" });
    }

    const latex = await generateCV({
      resume,
      jobDescription,
      additionalInfo
    });

    const { id, pdfPath } = await compileLatex(latex);

    cvStore.set(id, pdfPath);

    res.json({
      cvId: id,
      previewUrl: `/api/cv/preview/${id}`,
      downloadUrl: `/api/cv/download/${id}`,
      latex
    });
  } catch (err) {
    console.error("CV ERROR:", err.message);
    res.status(500).json({ error: "CV generation failed" });
  }
});

router.get("/preview/:id", (req, res) => {
  const pdfPath = cvStore.get(req.params.id);
  if (!pdfPath) return res.sendStatus(404);

  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(path.resolve(pdfPath));
});

router.get("/download/:id", (req, res) => {
  const pdfPath = cvStore.get(req.params.id);
  if (!pdfPath) return res.sendStatus(404);

  res.download(path.resolve(pdfPath), "cv-craft-resume.pdf");
});

export default router;
