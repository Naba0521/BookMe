import { Router } from "express";
import {
  createCompanyController,
  deleteCompanyController,
  getCompaniesController,
  getCompanyByIdController,
  getCompanyController,
  updateCompanyController,
} from "../controllers/company";

const companyRouter = Router();

companyRouter
  .post("/company", createCompanyController)
  .get("/company", getCompaniesController)
  .get("/company/name/:companyName", getCompanyController)
  .get("/company/id/:companyId", getCompanyByIdController)
  .put("/company/:companyId", updateCompanyController)
  .delete("/company/:companyId", deleteCompanyController);
export default companyRouter;
