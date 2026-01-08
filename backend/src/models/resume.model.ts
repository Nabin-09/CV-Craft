import { Schema, model, Document, Types } from "mongoose";

export interface IResume extends Document {
  userId: Types.ObjectId;
  sourceDraftId: Types.ObjectId;
  atsResume: {
    summary: string;
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      points: string[];
    }>;
    projects: Array<{
      name: string;
      points: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      startYear: string;
      endYear: string;
      details: string[];
    }>;
  };
  pdfGeneratedAt?: Date;
  createdAt: Date;
}

const resumeSchema = new Schema<IResume>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sourceDraftId: { type: Schema.Types.ObjectId, ref: "ResumeDraft", required: true },
  atsResume: { type: Object, required: true }, // Stores the strict JSON output
  pdfGeneratedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Resume = model<IResume>("Resume", resumeSchema);