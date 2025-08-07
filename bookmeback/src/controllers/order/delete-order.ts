import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";

export const deleteOrderController: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Booking.findByIdAndDelete(id);
    if (!deletedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted", deletedOrder });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order" });
    return;
  }
};
