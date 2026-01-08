import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  await registerUser(email, password);
  res.status(201).json({ message: "User created" });
};

export const login = async (req: Request, res: Response) => {
  console.log("Received body:", req.body);
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const tokens = await loginUser(email, password);
    res.cookie("accessToken", tokens.accessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.refreshToken, { httpOnly: true });
    res.json({ message: "Logged in" });
  } catch (error: any) {
    res.status(401).json({ message: error.message || "Login failed" });
  }
};