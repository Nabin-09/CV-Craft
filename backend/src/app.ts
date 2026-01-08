import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/user/user.routes";
import resumeDraftRoutes from './modules/resumeDraft/resumeDraft.routes'
import resumeRoutes from './modules/resume/resume.routes'
export const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/resume-draft", resumeDraftRoutes);
app.use("/api/v1/resume", resumeRoutes);




app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
