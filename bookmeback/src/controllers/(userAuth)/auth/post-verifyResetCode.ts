import { RequestHandler } from "express";
import { User } from "../../../models";

export const VerifyCode: RequestHandler = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      Date.now() > user.resetCodeExpires.getTime()
    ) {
      res
        .status(400)
        .json({ message: "Код буруу эсвэл хугацаа нь дууссан байна." });
      return;
    }

    res.status(200).json({ message: "Код зөв байна." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Серверийн алдаа." });
  }
};
