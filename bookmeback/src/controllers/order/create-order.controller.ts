import { RequestHandler } from "express";
import { Booking } from "../../models/booking.schema";
import { format } from "date-fns";
import { Company } from "../../models/company.schema";

export const CreateOrderController: RequestHandler = async (
  req,
  res
): Promise<void> => {
  const { company, user, status, employee, selectedTime } = req.body;
  console.log(req.body);

  const parsedDate = new Date(selectedTime);
  if (isNaN(parsedDate.getTime())) {
    res.status(400).json({ message: "Invalid selectedTime format" });
    return;
  }
  const formattedSelectedTime = format(parsedDate, "yyyy-MM-dd HH:mm");
  // console.log("formattedSelectedTime", formattedSelectedTime);
  const existingBooking = await Booking.findOne({
    employee,
    selectedTime: formattedSelectedTime,
    status: { $ne: "cancelled" },
  });
  console.log("existingBooking", existingBooking);
  if (existingBooking) {
    res
      .status(409)
      .json({ message: "Тэр цаг аль хэдийн захиалга авсан байна." });
    return;
  }

  try {
    const order = await Booking.create({
      company,
      user,
      status,
      employee,
      selectedTime: formattedSelectedTime,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    await Company.findByIdAndUpdate(company, {
      $push: { bookings: order._id },
    });

    res.status(201).json({ message: "order created", order }); // <-- IMPORTANT: add `return`
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message: "Тэр цаг аль хэдийн захиалга авсан байна (unique index).",
      });
    }

    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
};

