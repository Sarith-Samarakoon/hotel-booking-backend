import express from "express";
import {
  getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  loginUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.post("/", postUsers);

userRouter.delete("/", deleteUsers);

userRouter.put("/", putUsers);

userRouter.post("/login", loginUser);

export default userRouter;

// userRouter.get("/", (req, res) => {
//   res.json({
//     message: "This is the get request",
//   });
// });

// userRouter.post("/", (req, res) => {
//   res.json({
//     message: "This is a post request",
//   });
// });

// userRouter.delete("/", (req, res) => {
//   res.json({
//     message: "This is a delete request",
//   });
// });

// userRouter.put("/", (req, res) => {
//   res.json({
//     message: "This is a put request",
//   });
// });
