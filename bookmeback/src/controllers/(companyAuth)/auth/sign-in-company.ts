import { RequestHandler } from "express";
import { Company } from "../../../models/company.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signInCompanyController: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) {
      res.status(404).json({ message: "Имэйл эсвэл нууц үг буруу" });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, company.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Имэйл эсвэл нууц үг буруу" });
      return;
    }

    const token = jwt.sign(
      { companyId: company._id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const { password: _, ...companyData } = company.toObject();

    res.status(200).json({
      token,
      company: companyData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Сервер дээр алдаа гарлаа",
      error,
    });
  }
};
