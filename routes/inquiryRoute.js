import express from "express";
import {
  createInquiry,
  getInquiries,
  getInquiriesByStatus,
  addAdminReply,
  updateInquiry,
  deleteInquiry,
} from "../controllers/inquiryControllers.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/", createInquiry); // Create an inquiry
inquiryRouter.get("/", getInquiries); // Get all inquiries
inquiryRouter.get("/status/:status", getInquiriesByStatus); // Get inquiries by status
inquiryRouter.patch("/:id/reply", addAdminReply); // Add admin reply
inquiryRouter.put("/:id", updateInquiry); // Update an inquiry
inquiryRouter.delete("/:id", deleteInquiry); // Delete an inquiry

export default inquiryRouter;
