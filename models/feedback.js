import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the User model
      required: true,
    },
    bookingId: {
      type: String,
      ref: "Booking", // Reference to the Booking model
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true, // Ensure user's name is stored
      trim: true,
    },
    userEmail: {
      type: String,
      required: true, // Ensure user's email is stored
      trim: true,
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    userProfileImage: {
      type: String,
      default: null, // Default to null if no profile image is provided
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1, // Minimum rating
      max: 5, // Maximum rating
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      maxlength: [1000, "Feedback message cannot exceed 1000 characters"],
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the submission date
    },
    adminResponse: {
      type: String,
      trim: true,
      default: null, // Set to null initially and updated when admin responds
    },
    responded: {
      type: Boolean,
      default: false, // Flag to indicate if the feedback has been responded to
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
