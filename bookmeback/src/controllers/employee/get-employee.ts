import { RequestHandler } from "express";
import { Employee } from "../../models/employee.schema";
import "../../models/company.schema";
export const getEmployee: RequestHandler = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ message: "Employee олдсонгүй" });
      return;
    }
    res.status(200).json({ employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
