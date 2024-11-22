import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/usersRoute.js";
import galleryItemRouter from "./routes/galleryItemRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import jwt from "jsonwebtoken";
import dotenv, { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract token from Authorization header

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        console.error("Invalid token:", err.message); // Log token errors
        next(); // Continue without user if token is invalid
      } else {
        req.user = decoded; // Attach decoded token to req.user
        next();
      }
    });
  } else {
    next(); // No token, continue without user
  }
});

mongoose
  .connect(connection)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use("/api/users", userRouter);
app.use("/api/gallery", galleryItemRouter);
app.use("/api/category", categoryRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

app.listen(5000, (req, res) => {
  console.log("Server is running on port 5000");
});

// app.get("/", (req, res) => {
//   console.log("Get Request");
//   const name = req.body.name;
//   const age = req.body.age;
//   const message = "Hi " + name + " Your age is " + age + " years old.";
//   res.json({
//     message: message,
//   });
// });

// app.get("/users/", (req, res) => {
//   res.json({
//     message: "User List",
//   });
// });

// app.post("/users/", (req, res) => {
//   const name = req.body.name;
//   res.json({
//     message: "User Created",
//     name: name,
//   });
// });

// app.post("/", (req, res) => {
//   const name = req.body.name;
//   const age = req.body.age;
//   const message = "Hi " + name + " Your age is " + age + " years old.";

//   console.log("Post Request");
//   res.status(200).json({
//     message: message,
//   });
// });
