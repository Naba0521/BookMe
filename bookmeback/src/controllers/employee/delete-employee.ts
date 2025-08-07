import { RequestHandler } from "express";
import { Employee } from "../../models";

export const deleteEmployee: RequestHandler = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    if (!deletedEmployee) {
      res.status(404).json({ message: "Ажилтан олдсонгүй." });
      return;
    }
    res.status(200).json({deletedEmployee, message: "Ажилтан амжилттай устгагдлаа." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Сервер алдаа!!!" });
    return;
  }
};
