import { Request, Response } from "express";
import { Resume } from "../../models/resume.model";
import { User } from "../../models/user.model";
import { generatePDF } from "./resume.pdf";
import { generateResume } from "./resume.service";

export const generateMyResume = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const resume = await generateResume(userId);
    
    res.status(201).json({
      message: "Resume generated successfully",
      data: resume
    });
  } catch (error: any) {
    console.error("Stage 4 Error:", error.message);
    
    // Standardized error response [cite: 213]
    const statusCode = error.message === "DRAFT_NOT_FOUND" ? 404 : 500;
    res.status(statusCode).json({
      message: error.message || "An error occurred during resume generation",
      code: error.message === "DRAFT_NOT_FOUND" ? "RESUME_NOT_FOUND" : "LLM_ERROR"
    });
  }
};
export const downloadResumePDF = async (req: Request, res: Response) => {
    try {
        const { resumeId } = req.params;
        const userId = (req as any).user.id;

        // 1. Fetch Resume and verify ownership [cite: 188, 189]
        const resume = await Resume.findById(resumeId);
        if (!resume || resume.userId.toString() !== userId) {
            return res.status(403).json({ message: "Ownership mismatch", code: "FORBIDDEN" }); 
        }

        // 2. Fetch User for email (since no Profile exists) [cite: 93]
        const user = await User.findById(userId);
        if (!user) throw new Error("USER_NOT_FOUND");

        // 3. Generate PDF Buffer [cite: 195]
        const pdfBuffer = await generatePDF(resume, user.email);

        // 4. Stream Response [cite: 196, 201, 202]
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);
        res.send(pdfBuffer);

    } catch (error: any) {
        console.error("PDF_GEN_FAILED:", error);
        res.status(500).json({ 
            message: "Puppeteer error", 
            code: "PDF_GEN_FAILED" 
        }); 
    }
};