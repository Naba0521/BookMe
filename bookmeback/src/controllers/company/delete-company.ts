import { RequestHandler } from "express";
import { Company } from "../../models/company.schema";


export const deleteCompanyController: RequestHandler = async (req, res) => {
  try {
    const { companyId } = req.params;

    const deletedCompany = await Company.findByIdAndDelete({ companyId});

    if (!deletedCompany) {
      res.status(404).json({ message: "Company not found" });
      return; 
    }

    res.status(200).json({ message: "Company deleted", user: deletedCompany});
    return; 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting company" });
    return; 
  }
};
