import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1200 }, // Start from 1200
});

export const Counter = mongoose.model("Counter", counterSchema);
