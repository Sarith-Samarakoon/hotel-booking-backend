import Booking from "../models/booking.js";
import { isCustomerValidate, isUserValidate } from "./userControllers.js";
import { Counter } from "../models/counter.js";

// export function createBooking(req, res) {
//   if (!isCustomerValidate(req)) {
//     res.status(403).json({
//       message: "Forbidden",
//     });
//     return;
//   }
//   const startingId = 1200;

//   Booking.countDocuments({})
//     .then((count) => {
//       console.log(count);
//       const newId = startingId + count + 1;
//       //Booking.findOne().sort({ bookingId: -1 })
//       const newBooking = new Booking({
//         bookingId: newId,
//         roomId: req.body.roomId,
//         email: req.user.email,
//         start: req.body.start,
//         end: req.body.end,
//         notes: req.body.notes || "",
//         guests: req.body.guests, // Add guests field
//       });
//       newBooking.save().then((result) => {
//         res.json({
//           message: "Booking created successfully",
//           result: result,
//         });
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: "Error creating booking",
//         error: err,
//       });
//     });
// }

export async function createBooking(req, res) {
  if (!isCustomerValidate(req)) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    // Fetch and increment the bookingId counter
    const counter = await Counter.findOneAndUpdate(
      { name: "bookingId" }, // Counter name
      { $inc: { seq: 1 } }, // Increment sequence
      { new: true, upsert: true } // Create if doesn't exist
    );

    const newBooking = new Booking({
      bookingId: counter.seq, // Use the counter sequence
      roomId: req.body.roomId,
      email: req.user.email,
      start: req.body.start,
      end: req.body.end,
      notes: req.body.notes || "",
      guests: req.body.guests,
    });

    const result = await newBooking.save();
    res.json({
      message: "Booking created successfully",
      result: result,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      message: "Error creating booking",
      error: error.message,
    });
  }
}

export function getBookings(req, res) {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  if (isUserValidate(req)) {
    Booking.find()
      .skip(skip)
      .limit(limit)
      .then((bookings) => {
        Booking.countDocuments().then((total) => {
          res.json({
            message: "All bookings retrieved successfully",
            bookings: bookings,
            pagination: {
              total: total,
              page: page,
              limit: limit,
              totalPages: Math.ceil(total / limit),
            },
          });
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
      .skip(skip)
      .limit(limit)
      .then((bookings) => {
        Booking.countDocuments({ email: req.user.email }).then((total) => {
          res.json({
            message: "Your bookings retrieved successfully",
            bookings: bookings,
            pagination: {
              total: total,
              page: page,
              limit: limit,
              totalPages: Math.ceil(total / limit),
            },
          });
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

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the booking by ID
    const deletedBooking = await Booking.findOneAndDelete({ bookingId: id });
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking deleted successfully",
      deletedBooking,
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params; // Booking ID passed as a route parameter
    const updateData = req.body; // Data to update

    // Find the booking by ID and update it with the new data
    const updatedBooking = await Booking.findOneAndUpdate(
      { bookingId: id },
      updateData,
      { new: true } // Return the updated booking
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking updated successfully",
      updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};
