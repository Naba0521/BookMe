import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";

export const getOrdersByEmployee: RequestHandler = async (req, res) => {

  try {
    const { id } = req.params;
    const bookings = await Booking.find({ employee: id }).populate("user") 
    if(!id|| id==""){
      res.status(400).json({ message: "ID is required." });
      return;
    }
    if (!bookings || bookings.length === 0) {
      res.status(200).json({ message: "танид захиалга байхгүй байна." , bookings: [] });
      return;
    }
    res.status(200).json({ message: "Таны захиалгууд", bookings });
   console.log(req.body);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};