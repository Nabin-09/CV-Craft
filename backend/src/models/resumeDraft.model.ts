import mongoose from "mongoose";

const resumeDraftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    role: String,
    summary: String,

    experience: [
      {
        company: String,
        title: String,
        bullets: [String]
      }
    ],

    skills: [String],

    projects: [
      {
        name: String,
        description: String,
        tech: [String]
      }
    ],

    achievements: [String],

    rawCvText: String // extracted from uploaded CV PDF
  },
  { timestamps: true }
);

export const ResumeDraft = mongoose.model(
  "ResumeDraft",
  resumeDraftSchema
);
