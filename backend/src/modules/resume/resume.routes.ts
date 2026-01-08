import { Router } from "express";
import { generateMyResume, downloadResumePDF } from "./resume.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Endpoint for Stage 4: Resume Generation
router.post("/generate", authMiddleware, generateMyResume);

// Endpoint for Stage 5: PDF Download
router.get("/:resumeId/pdf", authMiddleware, downloadResumePDF);

export default router;