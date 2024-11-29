import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // The name of the person contacting
  },
  email: {
    type: String,
    required: true, // The email address of the person
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please fill a valid email address",
    ], // Email validation
  },
  message: {
    type: String,
    required: true, // The message or inquiry
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when the contact request was made
  },
});

const Contact = mongoose.model("contacts", contactSchema);
export default Contact;
