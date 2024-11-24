import express from "express";
import {
  createBooking,
  getBookings,
  retrieveBookingByDate,
  createBookingOnUsingCategory,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.post("/filter-date", retrieveBookingByDate);
bookingRouter.post("/create-by-category", createBookingOnUsingCategory);

export default bookingRouter;
