const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "test@test.com",
    password: "testers",
  },
];

async function getUsers(req, res, next) {
  let users;
  try {
    users = await User.find({}, "name image places");
  } catch (e) {
    return next(
      new HttpError("Fetching users failed, please try again later", 500)
    );
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}
async function signUp(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Something went wrong ", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("user already exist", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (e) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}
async function logIn(req, res, next) {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (e) {
    const error = new HttpError("Something went wrong ", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("invalid email or password ", 401);
    return next(error);
  }
  res.status(200).json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
}

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
