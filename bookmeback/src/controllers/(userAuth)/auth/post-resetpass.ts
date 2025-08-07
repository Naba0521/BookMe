// src/controllers/(userAuth)/auth/post-resetPassword.ts
import { RequestHandler } from "express";
import { User } from "../../../models";
import bcrypt from "bcrypt";

export const ResetPassword: RequestHandler = async (req, res) => {
  try {
    const { email, newPassword, code } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({ message: "Email болон шинэ нууц үг хэрэгтэй." });
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !user.resetCode || !user.resetCodeExpires) {
      res.status(400).json({ message: "Код буруу эсвэл хугацаа дууссан." });
      return;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Нууц үг амжилттай шинэчлэгдлээ." });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Серверийн алдаа." });
    return;
  }
};
