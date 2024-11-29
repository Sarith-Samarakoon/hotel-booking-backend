import Contact from "../models/contact.js";
import { isUserValidate, isCustomerValidate } from "./userControllers.js";

// Create a Contact Message
export function createContactMessage(req, res) {
  if (!isCustomerValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const newMessage = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    timestamp: new Date(),
  });

  newMessage
    .save()
    .then((result) => {
      res.json({
        message: "Message sent successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error sending message",
        error: err,
      });
    });
}

// Get All Contact Messages (Admin Only)
export function getAllContactMessages(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  Contact.find()
    .then((messages) => {
      res.json({
        message: "All messages retrieved successfully",
        messages: messages,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error retrieving messages",
        error: err,
      });
    });
}

// Get Messages by User Email
export function getUserMessages(req, res) {
  if (isUserValidate(req)) {
    Contact.find({ email: req.user.email })
      .then((messages) => {
        res.json({
          message: "Your messages retrieved successfully",
          messages: messages,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Error retrieving your messages",
          error: err,
        });
      });
  } else {
    res.status(403).json({
      message: "Forbidden",
    });
  }
}

// Filter Messages by Date Range (Admin Only)
export function filterMessagesByDate(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const start = new Date(req.body.start);
  const end = new Date(req.body.end);

  Contact.find({
    timestamp: {
      $gte: start,
      $lte: end,
    },
  })
    .then((messages) => {
      res.json({
        message: "Filtered messages retrieved successfully",
        messages: messages,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to retrieve filtered messages",
        error: err,
      });
    });
}

// // Admin Respond to a Contact Message
// export function respondToMessage(req, res) {
//   if (!isUserValidate(req)) {
//     res.status(403).json({
//       message: "Forbidden",
//     });
//     return;
//   }

//   const { messageId, response } = req.body;

//   Contact.findOneAndUpdate(
//     { messageId: messageId },
//     { adminResponse: response, responded: true },
//     { new: true }
//   )
//     .then((updatedMessage) => {
//       res.json({
//         message: "Response sent successfully",
//         updatedMessage: updatedMessage,
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: "Failed to send response",
//         error: err,
//       });
//     });
// }
