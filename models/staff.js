import mongoose from "mongoose";

const staffSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract"],
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // URL or file path to the event's image
    required: true,
  },
});

const Staff = mongoose.model("staff", staffSchema);
export default Staff;
