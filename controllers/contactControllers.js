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

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 messages per page
  const skip = (page - 1) * limit;

  Contact.find()
    .skip(skip)
    .limit(limit)
    .then((messages) => {
      Contact.countDocuments().then((total) => {
        res.json({
          message: "All messages retrieved successfully",
          messages: messages,
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
        message: "Error retrieving messages",
        error: err,
      });
    });
}

// Toggle the read/unread status of a Contact Message (Admin Only)
export function toggleReadStatus(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const { id } = req.params; // The ID of the message to toggle read/unread

  Contact.findById(id)
    .then((message) => {
      if (!message) {
        return res.status(404).json({
          message: "Message not found",
        });
      }

      // Toggle the read status (true becomes false and false becomes true)
      message.read = !message.read;

      // Save the updated message
      return message.save();
    })
    .then((updatedMessage) => {
      res.json({
        message: `Message marked as ${
          updatedMessage.read ? "read" : "unread"
        } successfully`,
        updatedMessage: updatedMessage,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error updating message status",
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

// Delete a Contact Message (Admin Only)
export function deleteContactMessage(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }

  const { id } = req.params; // Use `_id` instead of `messageId`

  Contact.findByIdAndDelete(id)
    .then((deletedMessage) => {
      if (deletedMessage) {
        res.json({
          message: "Message deleted successfully",
          deletedMessage: deletedMessage,
        });
      } else {
        res.status(404).json({
          message: "Message not found",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to delete message",
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
