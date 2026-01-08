import { Profile } from "../../models/profile.model";

export const upsertProfile = async (userId: string, data: any) => {
  return Profile.findOneAndUpdate(
    { userId },
    { ...data, userId },
    { new: true, upsert: true }
  );
};

export const getProfile = async (userId: string) => {
  return Profile.findOne({ userId });
};
