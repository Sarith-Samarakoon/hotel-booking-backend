import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  reason: {
    type: String,
    default: "",
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
  timesStamp: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Bookings", bookingSchema);
export default Booking;
