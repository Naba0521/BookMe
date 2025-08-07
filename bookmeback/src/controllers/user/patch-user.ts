import { RequestHandler } from "express";
import { User } from "../../models";

export const patchUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({ message: "User Id is required" });
      return;
    }

    updateData.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Patch user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
