import express from "express";
import { getStats } from "../controllers/statControllers.js";
const statRouter = express.Router();

// Route to get statistics
statRouter.get("/", getStats);

export default statRouter;
