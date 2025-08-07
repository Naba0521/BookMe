import { Router } from "express";
import { getTravelTime } from "../controllers/google/google-direction-api";

const googleApiRouter = Router();

googleApiRouter.post("/googleApi", getTravelTime);

export default googleApiRouter;
