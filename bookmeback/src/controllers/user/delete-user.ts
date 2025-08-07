import { RequestHandler } from "express";
import { User } from "../../models";

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.body;
    await User.findByIdAndDelete(id, {});

    res.status(200).json({
      message: "Хэрэглэгч устлаа.",
    });
  } catch (error) {
    res.status(500).json({
      message: "ALDAA",
    });
  }
};
