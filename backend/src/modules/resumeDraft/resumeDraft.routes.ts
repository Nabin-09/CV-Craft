import { Router } from "express";
import {
  getMyDraft,
  updateMyDraft,
  uploadCV
} from "./resumeDraft.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// All routes are protected by authMiddleware
router.get("/me", authMiddleware, getMyDraft);
router.patch("/me", authMiddleware, updateMyDraft);

router.post("/me/cv", authMiddleware, upload.single("cv"), uploadCV);

export default router;