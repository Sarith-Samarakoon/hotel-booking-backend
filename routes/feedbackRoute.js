import express from "express";
import { createFeedback } from "../controllers/feedbackControllers.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);

export default feedbackRouter;
