import { Router } from "express";
import { patchUser } from "../controllers/user/patch-user";
import { getUser } from "../controllers/user/get-user";
import { getUsers } from "../controllers/user/get-users";

const userRouter = Router();

userRouter
  .get("/user", getUsers)
  .get("/user/:id", getUser)
  .patch("/patch/:id", patchUser);

export default userRouter;
