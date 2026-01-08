import { Request, Response } from "express";
import { getDraft, upsertDraft } from "./resumeDraft.service";
import fs from "fs";
import * as PdfParse from 'pdf-parse-new';

export const getMyDraft = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const draft = await getDraft(userId);
    res.json(draft || { message: "No draft found" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching draft" });
  }
};

export const updateMyDraft = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const draft = await upsertDraft(userId, req.body);
    res.json(draft);
  } catch (error) {
    res.status(500).json({ message: "Error updating draft" });
  }
};


export const uploadCV = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!req.file) {
      return res.status(400).json({ message: "No CV uploaded" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);

    /**
     * ✅ Initialize the new Smart Parser
     * This library is much more stable for TypeScript
     */
    const parser = new PdfParse.SmartPDFParser();
    const data = await parser.parse(fileBuffer);

    const draft = await upsertDraft(userId, {
      rawCvText: data.text,
      updatedAt: new Date(),
    });

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      message: "CV uploaded and parsed successfully",
      extractedLength: data.text.length,
      data: draft
    });

  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ 
      message: "Error parsing PDF", 
      error: error.message 
    });
  }
};

