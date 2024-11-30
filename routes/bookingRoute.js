import express from "express";
import {
  createBooking,
  getBookings,
  retrieveBookingByDate,
  createBookingOnUsingCategory,
  deleteBooking,
  updateBooking,
} from "../controllers/bookingControllers.js";

const bookingRouter = express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/", getBookings);
bookingRouter.post("/filter-date", retrieveBookingByDate);
bookingRouter.post("/create-by-category", createBookingOnUsingCategory);
bookingRouter.delete("/:id", deleteBooking);
bookingRouter.put("/:id", updateBooking);

export default bookingRouter;
