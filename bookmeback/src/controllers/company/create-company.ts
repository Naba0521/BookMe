import { RequestHandler } from "express";
import { Company } from "../../models/company.schema";

export const createCompanyController: RequestHandler = async (req, res) => {
  try {
    const {
      companyName,
      address,
      companyLogo,
      phoneNumber,
      description,
      companyImages,
      employees,
      workingHours,
      lunchBreak,
      isActive,
      addressDetailed,
    } = req.body;

    if (
      !companyName ||
      !companyLogo ||
      !phoneNumber ||
      !address ||
      !description ||
      !workingHours
    ) {
      res.status(400).json({ message: "Бүх талбарыг бөглө" });
      return;
    }

    if (!Array.isArray(companyImages) || companyImages.length === 0) {
      res.status(400).json({ message: "Зураг оруулна уу" });
      return;
    }

    const company = await Company.create({
      companyName,
      address,
      companyLogo,
      phoneNumber,
      description,
      companyImages,
      employees,
      workingHours,
      lunchBreak,
      isActive,
      addressDetailed,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Company created", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating company" });
    return;
  }
};
