import Feedback from "../models/feedback.js";
import Booking from "../models/booking.js";
import { isCustomerValidate } from "./userControllers.js";

export async function createFeedback(req, res) {
  try {
    const user = req.user; // Assuming user is added to req by authentication middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Debug: Log user details
    console.log("User Details:", user);

    // Find the most recent booking by user's email
    const booking = await Booking.findOne({ email: user.email }).sort({
      end: -1,
    });
    if (!booking) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    if (!isCustomerValidate(req)) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Only customers can provide feedback" });
    }

    const feedback = {
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      bookingId: booking.bookingId, // Assuming bookingId is stored as a string
      roomId: booking.roomId,
      userProfileImage: user.image || "null", // Add a default image if null
      rating: req.body.rating,
      message: req.body.message,
    };

    const newFeedback = new Feedback(feedback);
    await newFeedback.save();

    res.status(201).json({
      message: "Feedback created successfully",
      feedback: newFeedback,
    });
  } catch (err) {
    console.error("Error creating feedback:", err);
    res.status(500).json({
      message: "Failed to create feedback",
      error: err.message || err,
    });
  }
}
