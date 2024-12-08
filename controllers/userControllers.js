import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Otp from "../models/otp.js";

dotenv.config();

export function postUsers(req, res) {
  const user = req.body;
  // console.log(user);

  const password = req.body.password;

  const saltRounds = 10;

  const passwordHash = bcrypt.hashSync(password, saltRounds);
  console.log(passwordHash);
  user.password = passwordHash;

  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      const otp = Math.floor(1000 + Math.random() * 9000);

      const newOtp = new Otp({
        email: user.email,
        otp: otp,
      });
      newOtp.save().then(() => {
        sendOtpEmail(user.email, otp);
        res.json({
          message: "User Created Successfully",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "User creation failed",
        error: err.message,
      });
    });
}

export function deleteUsers(req, res) {
  if (!isUserValidate(req)) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  const email = req.params.email; // Extract email from route parameter

  User.findOneAndDelete({ email: email })
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.json({
        message: "User deleted successfully",
      });
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).json({
        message: "User delete failed",
      });
    });
}

export function putUsers(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or missing token",
    });
  }

  const updates = req.body; // The updated fields from the request body

  // Prevent updating sensitive fields (e.g., password or type) directly
  const allowedUpdates = [
    "firstName",
    "lastName",
    "phone",
    "whatsApp",
    "email",
    "image",
  ];
  const updateKeys = Object.keys(updates);

  const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

  if (!isValidUpdate) {
    return res.status(400).json({
      message: "Invalid updates. Only specific fields can be updated.",
    });
  }

  User.findByIdAndUpdate(
    req.user.id, // The logged-in user's ID
    { $set: updates }, // Apply updates
    { new: true, runValidators: true } // Return the updated document and validate updates
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.json({
        message: "User updated successfully",
        user: updatedUser,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to update user details",
        error: err.message,
      });
    });
}

export function loginUser(req, res) {
  const credentials = req.body;

  if (!credentials.email || !credentials.password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  User.findOne({ email: credentials.email })
    .then((user) => {
      if (user == null) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isPasswordValid = bcrypt.compareSync(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(403).json({
          message: "Incorrect password",
        });
      }

      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
        image: user.image,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: "48h",
      });

      res.json({
        message: "Login Successful",
        user: user,
        token: token,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    });
}

export function isUserValidate(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.type != "admin") {
    return false;
  }
  return true;
}

export function isCustomerValidate(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.type != "customer") {
    return false;
  }
  return true;
}

export function getUsers(req, res) {
  if (!isUserValidate(req)) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }

  // Extract pagination parameters from the query string
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit; // Calculate how many documents to skip

  User.find()
    .skip(skip)
    .limit(limit)
    .then((users) => {
      // Count total users for pagination metadata
      User.countDocuments()
        .then((total) => {
          res.json({
            message: "Users fetched successfully",
            users: users,
            pagination: {
              total: total,
              page: page,
              limit: limit,
              totalPages: Math.ceil(total / limit),
            },
          });
        })
        .catch((err) => {
          console.error("Error counting users:", err);
          res.status(500).json({
            message: "Failed to fetch user count",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to fetch users",
        error: err.message,
      });
    });
}

export function getLoggedInUser(req, res) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      message: "Unauthorized: Invalid or missing token",
    });
  }

  User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.json({
        message: "User fetched successfully",
        user: user,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to fetch user details",
        error: err.message,
      });
    });
}

export function sendOtpEmail(email, otp) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "samarakoonsarith@gmail.com",
      pass: "pepv vhyp xdmk dlho",
    },
  });

  const message = {
    from: "samarakoonsarith@gmail.com",
    to: email,
    subject: "Validating OTP",
    text: "Your otp code is " + otp,
  };

  transport.sendMail(message, (err, info) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to send email",
        error: err.message,
      });
    }
    res.json({
      message: "Email sent successfully",
      info: info,
    });
  });
}

export function verifyUserEmail(req, res) {
  const otp = req.body.otp;
  const email = req.body.email;

  Otp.find({ email: email })
    .sort({ date: -1 })
    .then((otpList) => {
      if (otpList.length === 0) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      } else {
        const latestOtp = otpList[0];
        if (latestOtp.otp === otp) {
          User.findOneAndUpdate({ email: email }, { emailVerified: true }).then(
            () => {
              res.json({
                message: "User email verified successfully",
              });
            }
          );
        } else {
          return res.status(400).json({
            message: "Invalid OTP",
          });
        }
      }
    });
}

//change type of user
export function changeUserType(req, res) {
  //validate admin
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  const userId = req.params.id;
  const type = req.body.type;

  User.findOneAndUpdate({ _id: userId }, { type: type })
    .then(() => {
      res.json({
        message: "User type updated",
      });
    })
    .catch((err) => {
      res.json({
        message: "User type update failed",
        error: err,
      });
    });
}

//disable or enable user
export function disableUser(req, res) {
  //validate admin
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Forbidden",
    });
    return;
  }
  const userId = req.params.id;
  const disabled = req.body.disabled;

  User.findOneAndUpdate({ _id: userId }, { disabled: disabled })
    .then(() => {
      res.json({
        message: "User disabled/enabled",
      });
    })
    .catch((err) => {
      res.json({
        message: "User disable/enable failed",
        error: err,
      });
    });
}
