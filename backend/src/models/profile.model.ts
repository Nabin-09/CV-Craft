import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    fullName: String,
    role: String,
    skills: [String],
    experience: String,
    linkedinUrl: String,
    twitterUrl: String,
    profileImageUrl: String
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
    