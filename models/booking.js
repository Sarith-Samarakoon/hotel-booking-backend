import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: Number,
    required: true,
    unique: true,
  },
  roomId: {
    type: mongoose.Schema.Types.String, // Reference to the room
    required: true, // Make it required if every booking must have a room
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
  guests: {
    type: Number, // Field for number of guests
    required: true, // Make it required
  },
  timesStamp: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Bookings", bookingSchema);
export default Booking;
