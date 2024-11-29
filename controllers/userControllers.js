import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

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
      res.json({
        message: "User Created Successfully",
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

  User.find()
    .then((users) => {
      res.json({
        message: "Users fetched successfully",
        users: users,
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
