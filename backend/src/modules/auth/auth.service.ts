import bcrypt from "bcrypt";
import { User } from "../../models/user.model";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

export const registerUser = async (email: string, password: string) => {
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash });
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("INVALID_CREDENTIALS");

  return {
    accessToken: signAccessToken({ id: user._id }),
    refreshToken: signRefreshToken({ id: user._id })
  };
};
