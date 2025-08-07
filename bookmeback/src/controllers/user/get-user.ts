import { RequestHandler } from "express";
import { User } from "../../models";

export const getUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ id })
      .populate({
        path: "booking",
        populate: [
          { path: "company", select: "name address avatarImage" },
          { path: "employee", select: "username phoneNumber" },
        ],
      })
      .select("-password");
    if (!user) {
      res.status(404).json({ message: "хэрэглэгч бүртгэлгүй  байна" });
      return;
    }
    res.status(200).json({ messega: "таны хайсан хэрэглэгч олдлоо", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
  return;
};
