import Booking from "../models/booking.js";
import Category from "../models/category.js";
import Room from "../models/room.js";
import User from "../models/user.js";
import Feedback from "../models/feedback.js";
import GalleryItem from "../models/galleryItem.js";
import Staff from "../models/staff.js";
import { isUserValidate } from "./userControllers.js";

// Fetch all statistics
export function getStats(req, res) {
  // Perform all count operations in parallel
  Promise.all([
    Booking.countDocuments(),
    Category.countDocuments(),
    Room.countDocuments(),
    User.countDocuments(),
    Feedback.countDocuments(),
    GalleryItem.countDocuments(),
    Staff.countDocuments(),
  ])
    .then(
      ([
        bookingsCount,
        categoriesCount,
        roomsCount,
        usersCount,
        feedbackCount,
        galleryItemsCount,
        staffCount,
      ]) => {
        res.json({
          bookings: bookingsCount,
          categories: categoriesCount,
          rooms: roomsCount,
          users: usersCount,
          feedback: feedbackCount,
          galleryItems: galleryItemsCount,
          staff: staffCount,
        });
      }
    )
    .catch((error) => {
      console.error("Error fetching stats:", error.message);
      res.status(500).json({
        message: "Failed to fetch stats",
        error: error.message,
      });
    });
}
