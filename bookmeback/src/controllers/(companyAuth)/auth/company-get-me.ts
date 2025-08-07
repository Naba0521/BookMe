import { RequestHandler } from "express";
import { Company } from "../../../models/company.schema";

export const getCompanyAuthMe: RequestHandler = async (req, res) => {
  try {
    const companyId = (req as any).companyId;
    console.log("companyId:", companyId);

    const company = await Company.findById(companyId)
      .select("-password")
      .populate({
        path: "bookings",
        populate: [
          {
            path: "user",
            select: "username address avatarImage booking phoneNumber",
          },
          { path: "employee" },
        ],
      })

      .populate("employees")
      .populate("users");
    if (!company) {
      res.status(404).json({ message: "Company not found" });
      return;
    }
    res.status(200).json(company);
  } catch (error: unknown) {
    console.error("GetCompanyAuthMe error:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Get me company error", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Get me company error", error: String(error) });
    }
  }
};
