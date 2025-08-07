import { RequestHandler } from "express";
import { User } from "../../models";

export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).json({ message: "хэрэглэгчид байхгүй байна" });
      return;
    }
    res
      .status(200)
      .json({ message: "Бүх хэрэглэгчдийг танид харуулж байна", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
