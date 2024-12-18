import GalleryItem from "../models/galleryItem.js";

export function postGalleryItem(req, res) {
  const user = req.user;
  if (user == null) {
    res.status(403).json({
      message: "Please login to create a gallery item",
    });
    return;
  }
  if (user.type != "admin") {
    res.status(403).json({
      message: "You do not have permission to create a gallery item",
    });
    return;
  }

  const galleryItem = req.body.item;

  const newGalleryItem = new GalleryItem(galleryItem);
  newGalleryItem
    .save()
    .then(() => {
      res.json({
        message: "Gallery Created Successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Gallery Creation Failed",
        message: err.message,
      });
    });
}

export function getGalleryItems(req, res) {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 100; // Default to 100 items per page
  const skip = (page - 1) * limit; // Calculate skip value

  GalleryItem.find()
    .skip(skip)
    .limit(limit)
    .then((list) => {
      GalleryItem.countDocuments().then((total) => {
        res.json({
          list: list,
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
        message: "Gallery reading failed",
      });
    });
}

export function deleteGalleryItem(req, res) {
  const id = req.params.id;
  const user = req.user;

  if (user == null) {
    res.status(403).json({
      message: "Please login to delete a gallery item",
    });
    return;
  }

  if (user.type != "admin") {
    res.status(403).json({
      message: "You are not authorized to delete a gallery item",
    });
    return;
  }

  GalleryItem.findByIdAndDelete(id)
    .then(() => {
      res.json({
        message: "Gallery Item deleted successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Gallery Item deletion failed",
      });
    });
}

export function updateGalleryItem(req, res) {
  const id = req.params.id;
  const user = req.user;

  if (user == null) {
    res.status(403).json({
      message: "Please login to update a gallery item",
    });
    return;
  }

  if (user.type != "admin") {
    res.status(403).json({
      message: "You are not authorized to update a gallery item",
    });
    return;
  }

  const galleryItem = req.body;

  GalleryItem.findByIdAndUpdate(id, galleryItem)
    .then(() => {
      res.json({
        message: "Gallery Item updated successfully",
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Gallery Item update failed",
      });
    });
}
