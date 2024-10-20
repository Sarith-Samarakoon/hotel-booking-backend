import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryByName,
  updateCategory,
} from "../controllers/categoryControllers.js";

const categoryRouter = express.Router();

categoryRouter.post("/", createCategory);

categoryRouter.delete("/:name", deleteCategory);

categoryRouter.get("/:name", getCategoryByName);

categoryRouter.get("/", getCategories);

categoryRouter.put("/:name", updateCategory);

export default categoryRouter;
