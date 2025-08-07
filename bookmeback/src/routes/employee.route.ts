import { Router } from "express";
import { getEmployee } from "../controllers/employee/get-employee";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controllers/employee";

const employeeRouter = Router();

employeeRouter
  .post("/:companyName/employee", createEmployee)
  .get("/employee/:employeeId", getEmployee)
  .get("/employee", getEmployees)
  .put("/employee/:employeeId", updateEmployee)
  .delete("/employee/:employeeId", deleteEmployee);

export default employeeRouter;
