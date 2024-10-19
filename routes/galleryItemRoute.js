import express from "express";
import {
  getGalleryItems,
  postGalleryItem,
} from "../controllers/galleryItemController.js";

const galleryItemRouter = express.Router();

galleryItemRouter.post("/", postGalleryItem);

galleryItemRouter.get("/", getGalleryItems);

export default galleryItemRouter;
