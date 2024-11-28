import Event from "../models/event.js";
import { isUserValidate } from "./userControllers.js";

export function createEvent(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  const newEvent = new Event(req.body);
  newEvent
    .save()
    .then((result) => {
      res.json({
        message: "Event created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Event creation failed",
        error: err,
      });
    });
}

export function deleteEvent(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const id = req.params.id;
  Event.findByIdAndDelete(id)
    .then(() => {
      res.json({
        message: "Event deleted successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Event deletion failed",
      });
    });
}

export function getEvents(req, res) {
  Event.find()
    .then((result) => {
      res.json({
        events: result,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch events",
      });
    });
}

export function getEventById(req, res) {
  const id = req.params.id;
  Event.findById(id)
    .then((result) => {
      if (result == null) {
        res.json({
          message: "Event not found",
        });
      } else {
        res.json({
          event: result,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch event by ID",
      });
    });
}

export function updateEvent(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  const id = req.params.id;

  Event.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      res.json({
        message: "Event updated successfully",
        event: result,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to update event",
      });
    });
}
