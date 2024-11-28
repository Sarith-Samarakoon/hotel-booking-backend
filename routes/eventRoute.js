import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvents,
  getEventById,
  updateEvent,
} from "../controllers/eventControllers.js";

const eventRouter = express.Router();

// Create a new event
eventRouter.post("/", createEvent);

// Delete an event by ID
eventRouter.delete("/:id", deleteEvent);

// Get details of a specific event by ID
eventRouter.get("/:id", getEventById);

// Get all events
eventRouter.get("/", getEvents);

// Update an event by ID
eventRouter.put("/:id", updateEvent);

export default eventRouter;
