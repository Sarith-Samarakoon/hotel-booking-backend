import Inquiry from "../models/inquiry.js";
import { isCustomerValidate, isUserValidate } from "./userControllers.js";
import { Counter } from "../models/counter.js";

// Create Inquiry
export async function createInquiry(req, res) {
  try {
    const newInquiry = new Inquiry({
      name: req.body.name,
      email: req.user.email,
      phone: req.body.phone,
      inquiryType: req.body.inquiryType,
      message: req.body.message,
      status: "pending", // Default status
    });

    const result = await newInquiry.save();
    res.json({
      message: "Inquiry created successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({
      message: "Error creating inquiry",
      error: error.message,
    });
  }
}

// Get Inquiries (Admin: All, User: Own inquiries)
export async function getInquiries(req, res) {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    let inquiries, totalInquiries;

    if (isUserValidate(req)) {
      totalInquiries = await Inquiry.countDocuments();
      inquiries = await Inquiry.find().skip(skip).limit(limit);
    } else if (isCustomerValidate(req)) {
      const email = req.user.email;
      totalInquiries = await Inquiry.countDocuments({ email });
      inquiries = await Inquiry.find({ email }).skip(skip).limit(limit);
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({
      message: "Inquiries retrieved successfully",
      inquiries,
      pagination: {
        totalInquiries,
        page,
        limit,
        totalPages: Math.ceil(totalInquiries / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving inquiries:", error);
    res.status(500).json({
      message: "Error retrieving inquiries",
      error: error.message,
    });
  }
}

// Retrieve Inquiries by Status
export async function getInquiriesByStatus(req, res) {
  try {
    const { status } = req.params; // Status passed as a route parameter
    const inquiries = await Inquiry.find({ status });
    res.json({
      message: `Inquiries with status '${status}' retrieved successfully`,
      inquiries,
    });
  } catch (error) {
    console.error("Error retrieving inquiries by status:", error);
    res.status(500).json({
      message: "Error retrieving inquiries by status",
      error: error.message,
    });
  }
}

// Add Admin Reply
export async function addAdminReply(req, res) {
  try {
    const { id } = req.params; // Inquiry ID passed as a route parameter
    const { adminReply } = req.body; // Admin reply text

    const inquiry = await Inquiry.findOneAndUpdate(
      { inquiryId: id },
      { adminReply, status: "reviewed" }, // Update reply and status
      { new: true } // Return the updated inquiry
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.json({
      message: "Admin reply added successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Error adding admin reply:", error);
    res.status(500).json({
      message: "Failed to add admin reply",
      error: error.message,
    });
  }
}

// Update Inquiry
export function updateInquiry(req, res) {
  const id = req.params.id; // Get the inquiry ID from the route parameter
  const user = req.user; // Retrieve the logged-in user from the request (set by middleware)

  // Check if the user is logged in
  if (!user) {
    res.status(403).json({
      message: "Please login to update an inquiry",
    });
    return;
  }

  // Check if the user has admin privileges
  if (user.type !== "admin") {
    res.status(403).json({
      message: "You are not authorized to update an inquiry",
    });
    return;
  }

  const updatedInquiry = req.body; // Data to update

  // Proceed to update the inquiry
  Inquiry.findByIdAndUpdate(id, updatedInquiry, { new: true }) // Return the updated document
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          message: "Inquiry not found",
        });
      }
      res.json({
        message: "Inquiry updated successfully",
        updatedInquiry: result,
      });
    })
    .catch((error) => {
      console.error("Error updating inquiry:", error);
      res.status(500).json({
        message: "Inquiry update failed",
        error: error.message,
      });
    });
}

// Delete Inquiry
export function deleteInquiry(req, res) {
  const id = req.params.id; // Get the inquiry ID from the route parameter
  const user = req.user; // Retrieve the logged-in user from the request (set by middleware)

  // Check if the user is logged in
  if (!user) {
    res.status(403).json({
      message: "Please login to delete an inquiry",
    });
    return;
  }

  // Check if the user has admin privileges
  if (user.type !== "admin") {
    res.status(403).json({
      message: "You are not authorized to delete an inquiry",
    });
    return;
  }

  // Proceed to delete the inquiry
  Inquiry.findByIdAndDelete(id)
    .then(() => {
      res.json({
        message: "Inquiry deleted successfully",
      });
    })
    .catch((error) => {
      console.error("Error deleting inquiry:", error);
      res.status(500).json({
        message: "Inquiry deletion failed",
        error: error.message,
      });
    });
}
