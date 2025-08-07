import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";

export const updateOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      res.status(400).json({ message: "ID болон статус шаардлагатай" });
      return;
    }

    const updateOrder = await Booking.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!updateOrder) {
      res.status(404).json({ message: "Захиалга олдсонгүй" });
      return;
    }
    res.status(200).json({
      message: "Захиалгын статус амжилттай шинэчлэгдлээ",
      order: updateOrder,
    });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Статус шинэчлэхэд алдаа гарлаа" });
  }
};
