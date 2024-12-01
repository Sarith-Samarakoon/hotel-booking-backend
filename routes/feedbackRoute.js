import express from "express";
import {
  createFeedback,
  getFeedback,
  updateFeedback,
} from "../controllers/feedbackControllers.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getFeedback);
feedbackRouter.put("/:id", updateFeedback);

export default feedbackRouter;
