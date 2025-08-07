import { RequestHandler } from "express";
import { Company } from "../../models/company.schema";
import bcrypt from "bcrypt";

export const updateCompanyController: RequestHandler = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      res.status(400).json({ message: "Компаний ID олдсонгүй" });
      return;
    }

    const {
      email,
      companyName,
      companyLogo,
      phoneNumber,
      description,
      companyImages,
      backGroundImage,
      aboutUsImage,
      experience,
      clientNumber,
      address,
      city,
      lat,
      lng,
      employees,
      bookings,
      workingHours,
      lunchBreak,
      users,
      password,
      templateNumber,
      addressDetailed,
    } = req.body;

    const updatedData: any = {
      email,
      companyName,
      companyLogo,
      phoneNumber,
      description,
      companyImages,
      backGroundImage,
      aboutUsImage,
      experience,
      clientNumber,
      address,
      city,
      lat,
      lng,
      employees,
      bookings,
      workingHours,
      lunchBreak,
      users,
      password,
      templateNumber,
      addressDetailed,
      updatedAt: new Date(),
    };

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updatedData,
      { new: true }
    );

    if (!updatedCompany) {
      res.status(404).json({ message: "Компани олдсонгүй" });
      return;
    }

    res.status(200).json({
      message: "Компанийн мэдээлэл амжилттай шинэчлэгдлээ",
      company: updatedCompany,
    });
    return;
  } catch (error) {
    console.error("Компанийн мэдээлэл шинэчлэхэд алдаа гарлаа:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
