import { Router } from "express";
import { signupCompanyController } from "../controllers/(companyAuth)/auth/sign-up-company";
import { signInCompanyController } from "../controllers/(companyAuth)/auth/sign-in-company";
import { companyAuthMiddleware } from "../middlewares/companyAuthMiddleware";
import { getCompanyAuthMe } from "../controllers/(companyAuth)/auth/company-get-me";

const authCompanyRouter = Router();

authCompanyRouter
  .post("/signup", signupCompanyController)
  .post("/signin", signInCompanyController)
  .get("/me", companyAuthMiddleware, getCompanyAuthMe);

export default authCompanyRouter;
