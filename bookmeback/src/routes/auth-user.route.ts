import { Router } from "express";
import { postUserAuthSignUp } from "../controllers/(userAuth)/auth/post-userauth-signup";
import { postUserAuthSignIn } from "../controllers/(userAuth)/auth/post-userauth-signin";
import { getUserAuthMe } from "../controllers/(userAuth)/auth/get-userauth-me";
import { authenticationMiddleware } from "../middlewares/authentication-middlewares";
import { Forgotpass } from "../controllers/(userAuth)/auth/post-forgotpassword";
import { VerifyCode } from "../controllers/(userAuth)/auth/post-verifyResetCode";
import { ResetPassword } from "../controllers/(userAuth)/auth/post-resetpass";

const authUserRouter = Router();

authUserRouter
  .post("/signup", postUserAuthSignUp)
  .post("/login", postUserAuthSignIn)
  .get("/me", authenticationMiddleware, getUserAuthMe)
  .post("/forgot-password", Forgotpass)
  .post("/verify-code", VerifyCode)
  .post("/reset-password", ResetPassword);
export default authUserRouter;
