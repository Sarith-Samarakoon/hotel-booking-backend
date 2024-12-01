import express from "express";
import {
  createFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackControllers.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", createFeedback);
feedbackRouter.get("/", getFeedback);
feedbackRouter.put("/:id", updateFeedback);
feedbackRouter.delete("/:id", deleteFeedback);

export default feedbackRouter;
