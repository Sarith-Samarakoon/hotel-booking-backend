import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export function isUserValidate(req) {
  if (req.user == null) {
    return false;
  }
  if (req.user.type != "admin") {
    return false;
  }
  return true;
}

export function getUsers(req, res) {
  User.find()
    .then((userList) => {
      res.json({
        list: userList,
      });
    })
    .catch(() => {
      res.json({
        message: "User Reading Failed",
      });
    });

  // res.json({
  //   message: "This is the get request",
  // });
}

export function postUsers(req, res) {
  const user = req.body;
  // console.log(user);

  const password = req.body.password;

  const saltRounds = 10;

  const passwordHash = bcrypt.hashSync(password, saltRounds);
  console.log(passwordHash);
  user.password = passwordHash;

  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      res.json({
        message: "User Created Successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "User creation failed",
      });
    });
  // res.json({
  //   message: "This is a post request",
  // });
}

export function deleteUsers(req, res) {
  const email = req.body.email;
  User.deleteOne({ email: email })
    .then(() => {
      res.json({
        message: "User deleted successfully",
      });
    })
    .catch(() => {
      res.json({
        message: "User delete failed",
      });
    });

  // res.json({
  //   message: "This is a delete request",
  // });
}

export function putUsers(req, res) {
  res.json({
    message: "This is a put request",
  });
}

export function loginUser(req, res) {
  const credentials = req.body;

  User.findOne({ email: credentials.email }).then((user) => {
    if (user == null) {
      rex.status(404).json({
        message: "User not found",
      });
    } else {
      const isPasswordValid = bcrypt.compareSync(
        credentials.password,
        user.password
      );

      if (!isPasswordValid) {
        res.status(403).json({
          message: "Incorrect password",
        });
      } else {
        const payload = {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
        };

        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: "48h",
        });

        res.json({
          message: "Login Successful",
          user: user,
          token: token,
        });
      }
    }
  });
}
