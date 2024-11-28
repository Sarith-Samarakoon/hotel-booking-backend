import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaff,
  getStaffById,
  updateStaff,
} from "../controllers/staffController.js";

const staffRouter = express.Router();

// Create a new staff member
staffRouter.post("/", createStaff);

// Delete a staff member by ID
staffRouter.delete("/:id", deleteStaff);

// Get details of a specific staff member by ID
staffRouter.get("/:id", getStaffById);

// Get all staff members
staffRouter.get("/", getStaff);

// Update a staff member's details by ID
staffRouter.put("/:id", updateStaff);

export default staffRouter;
