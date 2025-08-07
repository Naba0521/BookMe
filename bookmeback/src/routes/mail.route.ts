import { Router } from "express";
import { postMail } from "../controllers/mail/post-mail";
import { checkAndSendReminders } from "../controllers/mail/auto-reminder-mail";

const emailRouter = Router();

emailRouter.post("/send-email", postMail);
emailRouter.get("/reminder", checkAndSendReminders);

export default emailRouter;
