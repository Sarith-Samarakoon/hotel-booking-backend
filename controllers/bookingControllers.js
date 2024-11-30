import Booking from "../models/booking.js";
import { isCustomerValidate, isUserValidate } from "./userControllers.js";

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
        notes: req.body.notes || "",
        guests: req.body.guests, // Add guests field
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

export function getBookings(req, res) {
  if (isUserValidate(req)) {
    Booking.find()
      .then((bookings) => {
        res.json({
          message: "All bookings retrieved successfully",
          bookings: bookings,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error retrieving bookings",
          error: err,
        });
      });
  } else if (isCustomerValidate(req)) {
    Booking.find({ email: req.user.email })
      .then((bookings) => {
        res.json({
          message: "Your bookings retrieved successfully",
          bookings: bookings,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error retrieving your bookings",
          error: err,
        });
      });
  } else {
    res.status(403).json({
      message: "Forbidden",
    });
  }
}

export function retrieveBookingByDate(req, res) {
  const start = req.body.start;
  const end = req.body.end;
  console.log(start);
  console.log(end);

  Booking.find({
    start: {
      $gte: start,
    },
    end: {
      $lte: end,
    },
  })
    .then((result) => {
      res.json({
        message: "Filtered Booking",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to retrieve filtered bookings",
        error: err,
      });
    });
}

export function createBookingOnUsingCategory(req, res) {
  const start = new Date(req.body.start);
  const end = new Date(req.body.end);

  Booking.find({
    $or: [
      {
        start: {
          $gte: start,
          $lte: end,
        },
      },
      {
        end: {
          $gte: start,
          $lte: end,
        },
      },
    ],
  }).then((response) => {
    const overlappingBookings = response;
    const rooms = [];

    for (let i = 0; i < overlappingBookings.length; i++) {
      rooms.push(overlappingBookings[i].roomId);
    }

    Room.find({
      roomId: {
        $nin: rooms,
      },
      category: req.body.category,
    }).then((rooms) => {
      if (rooms.length == 0) {
        res.json({
          message: "No available rooms in the specified category",
        });
      } else {
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
    });
  });
}
