import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  await registerUser(email, password);
  res.status(201).json({ message: "User created" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await loginUser(email, password);

  res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
  res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });

  res.json({ message: "Logged in" });
};
