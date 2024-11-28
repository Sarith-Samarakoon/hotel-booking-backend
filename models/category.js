import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  bedtype: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number, // Store the average rating as a number
    min: 0, // Minimum value is 0
    max: 5, // Maximum value is 5
    default: 0, // Default rating is 0
  },
});

const Category = mongoose.model("categories", categorySchema);
export default Category;
