import Feedback from "../models/feedback.js";
import Booking from "../models/booking.js";
import { isUserValidate, isCustomerValidate } from "./userControllers.js";

export async function getFeedback(req, res) {
  try {
    // Retrieve all feedback for both admin and customers
    if (isUserValidate(req) || isCustomerValidate(req)) {
      const feedback = await Feedback.find();
      return res.status(200).json({
        message: "All feedback retrieved successfully",
        feedback: feedback,
      });
    } else {
      // Forbidden for other roles
      return res.status(403).json({
        message: "Forbidden: You are not authorized to view feedback.",
      });
    }
  } catch (err) {
    console.error("Error retrieving feedback:", err);
    res.status(500).json({
      message: "Error retrieving feedback",
      error: err.message,
    });
  }
}

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
      userProfileImage:
        user.image ||
        "https://i.pinimg.com/736x/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg", // Add a default image if null
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

export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params; // Feedback ID passed as a route parameter
    const updateData = req.body; // Data to update
    const user = req.user; // User information from authentication middleware

    // Find the feedback by ID
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update the feedback with the new data
    Object.keys(updateData).forEach((key) => {
      feedback[key] = updateData[key];
    });

    // Save the updated feedback
    const updatedFeedback = await feedback.save();

    res.status(200).json({
      message: "Feedback updated successfully",
      updatedFeedback,
    });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({
      message: "Failed to update feedback",
      error: error.message,
    });
  }
};

// DELETE feedback by ID
export function deleteFeedback(req, res) {
  const id = req.params.id; // Feedback ID from request parameters
  const user = req.user; // User data from authentication middleware

  // Check if the user is logged in
  if (user == null) {
    res.status(403).json({
      message: "Please login to delete feedback",
    });
    return;
  }

  // Check if the user has admin privileges
  if (user.type != "admin") {
    res.status(403).json({
      message: "You are not authorized to delete feedback",
    });
    return;
  }

  // Find and delete feedback by ID
  Feedback.findByIdAndDelete(id)
    .then(() => {
      res.json({
        message: "Feedback deleted successfully",
      });
    })
    .catch((err) => {
      console.error("Error deleting feedback:", err);
      res.status(500).json({
        message: "Feedback deletion failed",
      });
    });
}
