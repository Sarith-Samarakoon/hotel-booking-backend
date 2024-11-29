import express from "express";
import {
  getUsers,
  putUsers,
  postUsers,
  deleteUsers,
  loginUser,
  getLoggedInUser,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);

userRouter.post("/", postUsers);

userRouter.delete("/:email", deleteUsers);

userRouter.put("/", putUsers);

userRouter.post("/login", loginUser);

userRouter.get("/me", getLoggedInUser); // Fetch logged-in user details

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
