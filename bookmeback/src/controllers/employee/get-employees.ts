import { RequestHandler } from "express";
import { Employee } from "../../models";

export const getEmployees: RequestHandler = async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (!employees || employees.length === 0) {
      res.status(404).json({ message: "Бүртгэлтэй ажилтан байхгүй байна." });
      return;
    }
    res.status(200).json({ employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Серверийн алдаа!!!" });
  }
};
