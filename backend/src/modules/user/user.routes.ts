import { Router } from "express";
import { getMyProfile, updateMyProfile } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { uploadProfileImage } from "./user.controller";

const router = Router();

router.get("/me", authMiddleware, getMyProfile);
router.put("/me", authMiddleware, updateMyProfile);
router.post(
  "/me/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadProfileImage
);


export default router;


