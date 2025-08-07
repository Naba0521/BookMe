import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectToDataBase } from "../src/database/connect-to-db";
import authUserRouter from "../src/routes/auth-user.route";
import authCompanyRouter from "../src/routes/auth-company.route";
import companyRouter from "../src/routes/company.route";
import emailRouter from "../src/routes/mail.route";
import BookingRouter from "../src/routes/order.route";
import employeeRouter from "../src/routes/employee.route";
import googleApiRouter from "../src/routes/google-api.route";
import userRouter from "../src/routes/user.route";

connectToDataBase();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(authCompanyRouter);
app.use(companyRouter);
app.use(BookingRouter);
app.use("/authuser", authUserRouter);
app.use("/email", emailRouter);
app.use(employeeRouter);
app.use(googleApiRouter);
app.use(userRouter);

app.listen(port, () => {
  console.log(`Sonsoj bnaa ${port}`);
});
