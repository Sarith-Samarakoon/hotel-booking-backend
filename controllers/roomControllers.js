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
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 100; // Default to 100 items per page

  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  Room.find()
    .skip(skip) // Skip the first `skip` documents
    .limit(limit) // Limit the results to `limit` documents
    .then((rooms) => {
      Room.countDocuments().then((totalRooms) => {
        const totalPages = Math.ceil(totalRooms / limit); // Calculate total pages

        res.json({
          message: "Rooms retrieved successfully",
          rooms,
          pagination: {
            total: totalRooms,
            page,
            limit,
            totalPages,
          },
        });
      });
    })
    .catch((err) => {
      console.error("Error retrieving rooms:", err);
      res.status(500).json({
        message: "Failed to retrieve rooms",
        error: err.message,
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
