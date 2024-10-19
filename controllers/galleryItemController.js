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
    .catch(() => {
      res.status(500).json({
        message: "Gallery Creation Failed",
      });
    });
}

export function getGalleryItems(req, res) {
  GalleryItem.find()
    .then((list) => {
      res.json({
        list: list,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Gallery reading failed",
      });
    });
}
