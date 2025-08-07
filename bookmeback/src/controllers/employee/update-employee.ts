import { RequestHandler } from "express";
import { Employee } from "../../models";

export const updateEmployee: RequestHandler = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      res.status(400).json({ message: "Ажилтан олдсонгүй." });
      return;
    }

    const {
      employeeName,
      description,
      profileImage,
      availability,
      duration,
      startTime,
      endTime,
      lunchTimeStart,
      lunchTimeEnd,
    } = req.body;

    const updatedData = {
      employeeName,
      description,
      profileImage,
      availability,
      duration,
      startTime,
      endTime,
      lunchTimeStart,
      lunchTimeEnd,
      updatedAt: new Date(),
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updatedData,
      { new: true }
    );

    res.status(200).json({
      updatedEmployee,
      message: "Ажилтны мэдээлэл амжилттай шинэчлэгдлээ.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Сервер алдаа!!!" });
  }
};
