import express from "express";
import path from "path";

import { generateCV } from "../services/groq.service.js";
import { generateResumePipeline } from "../services/resumePipeline.service.js";

const router = express.Router();
const cvStore = new Map(); // { id: pdfPath }

router.post("/generate", async (req, res) => {
  try {
    const { resume, jobDescription, additionalInfo } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: "Missing input" });
    }

    // 1. Generate LaTeX from LLM
    const latex = await generateCV({
      resume,
      jobDescription,
      additionalInfo
    });

    // 2. Run full resume pipeline
    const { id, pdfPath, atsScore } =
      await generateResumePipeline({
        latex,
        resumeSource: resume,
        jobDescription
      });

    // 3. Store PDF path
    cvStore.set(id, pdfPath);

    res.json({
      cvId: id,
      atsScore,
      previewUrl: `/api/cv/preview/${id}`,
      downloadUrl: `/api/cv/download/${id}`,
      latex
    });
  } catch (err) {
    console.error("CV ERROR:", err);
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

  res.download(
    path.resolve(pdfPath),
    "cv-craft-resume.pdf"
  );
});

export default router;
