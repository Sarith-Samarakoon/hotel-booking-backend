import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true, // Start date of the event
  },
  endDate: {
    type: Date,
    required: true, // End date of the event
  },
  description: {
    type: String,
  },
  image: {
    type: String, // URL or file path to the event's image
    required: true,
  },
});

const Event = mongoose.model("events", eventSchema);
export default Event;
