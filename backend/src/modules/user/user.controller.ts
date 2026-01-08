import { Request, Response } from "express";
import { getProfile, upsertProfile } from "./user.service";

export const getMyProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const profile = await getProfile(userId);
  res.json(profile);
};

export const updateMyProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const profile = await upsertProfile(userId, req.body);
  res.json(profile);
};
export const uploadProfileImage = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const imageUrl = `/uploads/${req.file?.filename}`;

  const profile = await upsertProfile(userId, {
    profileImageUrl: imageUrl
  });

  res.json(profile);
};

