import Booking from "../models/booking.js";
import { isCustomerValidate } from "./userControllers.js";

export function createBooking(req, res) {
  if (!isCustomerValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  const startingId = 1200;

  Booking.countDocuments({})
    .then((count) => {
      console.log(count);
      const newId = startingId + count + 1;
      //Booking.findOne().sort({ bookingId: -1 })
      const newBooking = new Booking({
        bookingId: newId,
        roomId: req.body.roomId,
        email: req.user.email,
        start: req.body.start,
        end: req.body.end,
      });
      newBooking.save().then((result) => {
        res.json({
          message: "Booking created successfully",
          result: result,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error creating booking",
        error: err,
      });
    });
}
