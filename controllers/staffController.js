import Staff from "../models/staff.js";
import { isUserValidate } from "./userControllers.js";

export function createStaff(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  const newStaff = new Staff(req.body);
  newStaff
    .save()
    .then((result) => {
      res.json({
        message: "Staff created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Staff creation failed",
        error: err,
      });
    });
}

export function deleteStaff(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const id = req.params.id;
  Staff.findByIdAndDelete(id)
    .then(() => {
      res.json({
        message: "Staff deleted successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Staff deletion failed",
      });
    });
}

export function getStaff(req, res) {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 100; // Default to 10 items per page
  const skip = (page - 1) * limit; // Calculate skip value

  Staff.find()
    .skip(skip)
    .limit(limit)
    .then((result) => {
      Staff.countDocuments().then((total) => {
        res.json({
          staff: result,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch staff",
      });
    });
}

export function getStaffById(req, res) {
  const id = req.params.id;
  Staff.findById(id)
    .then((result) => {
      if (result == null) {
        res.json({
          message: "Staff not found",
        });
      } else {
        res.json({
          staff: result,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch staff by ID",
      });
    });
}

export function updateStaff(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  const id = req.params.id;

  Staff.findByIdAndUpdate(id, req.body, { new: true })
    .then((result) => {
      res.json({
        message: "Staff updated successfully",
        staff: result,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to update staff",
      });
    });
}
