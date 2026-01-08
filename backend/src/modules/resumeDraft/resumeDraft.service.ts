import { ResumeDraft } from "../../models/resumeDraft.model";

export const upsertDraft = async (userId: string, data: any) => {
  return ResumeDraft.findOneAndUpdate(
    { userId },
    { $set: data },
    { new: true, upsert: true }
  );
};

export const getDraft = async (userId: string) => {
  return ResumeDraft.findOne({ userId });
};