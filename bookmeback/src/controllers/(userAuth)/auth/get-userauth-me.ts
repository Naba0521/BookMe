import { RequestHandler } from "express";
import { User } from "../../../models";

export const getUserAuthMe: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    console.log("userid:", userId);

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "booking",
        populate: [
          { path: "company", select: "name address avatarImage" },
          { path: "employee", select: "username phoneNumber" },
        ],
      });

    if (!user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "get me ", error });
  }
};
