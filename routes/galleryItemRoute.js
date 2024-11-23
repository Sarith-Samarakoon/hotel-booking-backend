import express from "express";
import {
  deleteGalleryItem,
  getGalleryItems,
  postGalleryItem,
  updateGalleryItem,
} from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", postGalleryItem);

galleryItemRouter.get("/", getGalleryItems);

galleryItemRouter.delete("/:id", deleteGalleryItem);

galleryItemRouter.put("/:id", updateGalleryItem);

export default galleryItemRouter;
