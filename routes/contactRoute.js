import express from "express";
import {
  createContactMessage,
  getAllContactMessages,
  getUserMessages,
  deleteContactMessage,
  filterMessagesByDate,
  toggleReadStatus,
  //   respondToMessage,
} from "../controllers/contactControllers.js";

const contactRouter = express.Router();

// Route to create a new contact message
contactRouter.post("/", createContactMessage);

// Route to get all contact messages (Admin only)
contactRouter.get("/", getAllContactMessages);

// Route to get all messages for a specific user (authenticated user only)
contactRouter.get("/user", getUserMessages);

// Route to filter messages by date range (Admin only)
contactRouter.post("/filter-date", filterMessagesByDate);

contactRouter.delete("/:id", deleteContactMessage); // Delete route using `_id`

contactRouter.put("/toggle-read-status/:id", toggleReadStatus);

// // Route for admin to respond to a contact message
// contactRouter.post("/respond", respondToMessage);

export default contactRouter;
