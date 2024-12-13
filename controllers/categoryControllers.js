import Category from "../models/category.js";
import { isUserValidate } from "./userControllers.js";

export function createCategory(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  const newCategory = new Category(req.body);
  newCategory
    .save()
    .then((result) => {
      res.json({
        message: "Category created successfully",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Category creation filed",
        error: err,
      });
    });
}

export function deleteCategory(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  const name = req.params.name;
  Category.findOneAndDelete({ name: name })
    .then(() => {
      res.json({
        message: "Category deleted successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Category deletion failed",
      });
    });
}

export function getCategories(req, res) {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 20; // Default to 10 categories per page
  const skip = (page - 1) * limit;

  Category.find()
    .skip(skip)
    .limit(limit)
    .then((categories) => {
      Category.countDocuments().then((total) => {
        res.json({
          categories: categories,
          pagination: {
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch categories",
      });
    });
}

export function getCategoryByName(req, res) {
  const name = req.params.name;
  Category.findOne({ name: name })
    .then((result) => {
      if (result == null) {
        res.json({
          message: "Category not found",
        });
      } else {
        res.json({
          category: result,
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to fetch category by name",
      });
    });
}

export function updateCategory(req, res) {
  if (!isUserValidate(req)) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }
  const name = req.params.name;

  Category.updateOne({ name: name }, req.body)
    .then(() => {
      res.json({
        message: "Category updated successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Failed to update category",
      });
    });
}
