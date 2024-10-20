import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/usersRoute.js";
import galleryItemRouter from "./routes/galleryItemRoute.js";
import jwt from "jsonwebtoken";
import dotenv, { config } from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const connection = process.env.MONGO_URL;

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (decoded != null) {
        req.user = decoded;
        next();
      } else {
        next();
      }
    });
  } else {
    next();
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
