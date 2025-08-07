import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";

export const getOrdersByUCompany: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ company: id })
      .populate("user")
      .populate("employee")
    

    res.status(200).json({
      message: "Захиалгууд амжилттай дуудагдлаа",
      bookings: bookings || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Серверийн алдаа гарлаа" });
  }
};
