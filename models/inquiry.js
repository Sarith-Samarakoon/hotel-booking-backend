import mongoose from "mongoose";

// Define Inquiry Schema
const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10,15}$/, "Phone number must be between 10-15 digits"],
    },
    inquiryType: {
      type: String,
      required: true,
      enum: ["Booking", "Event", "Room Details", "General"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "closed"],
      default: "pending",
    },
    adminReply: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create Inquiry model
const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
