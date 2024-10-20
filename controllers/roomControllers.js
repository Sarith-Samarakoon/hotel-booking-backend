import Room from "../models/room.js";
import { isUserValidate } from "./userControllers.js";

export function createRoom(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const newRoom = new Room(req.body);
  newRoom
    .save()
    .then((result) => {
      res.json({
        message: "Room created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to create room",
        error: err,
      });
    });
}

export function deleteRoom(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const roomId = req.params.roomId;
  Room.findOneAndDelete({ roomId: roomId })
    .then(() => {
      res.json({
        message: "Room deleted successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to delete room",
      });
    });
}

export function findRoomById(req, res) {
  const roomId = req.params.roomId;
  Room.findOne({ roomId: roomId })
    .then((result) => {
      if (result == null) {
        res.status(403).json({
          message: "Room not found",
        });
        return;
      } else {
        res.json({
          message: "Room found",
          result: result,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to find room",
        error: err,
      });
    });
}

export function getRooms(req, res) {
  Room.find()
    .then((result) => {
      res.json({
        message: "Rooms retrieved successfully",
        rooms: result,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to retrieve rooms",
      });
    });
}

export function updateRoom(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const roomId = req.params.roomId;
  Room.findOneAndUpdate({ roomId: roomId }, req.body)
    .then(() => {
      res.json({
        message: "Room updated successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "Failed to update room",
      });
    });
}

export function getRoomByCategory(req, res) {
  const category = req.params.category;
  Room.find({ category: category })
    .then((result) => {
      res.json({
        message: "Rooms retrieved successfully by category",
        rooms: result,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to retrieve rooms by category",
      });
    });
}
