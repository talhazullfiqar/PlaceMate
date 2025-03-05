const HttpError = require("../models/http-error");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const e = require("express");
// Dummy data
let DUMMY_PLACES = [
  {
    title: "Empire State1",
    description: "a very famous building1",
    coordinates: {
      lat: 40.748817,
      lng: -73.985428,
    },
    address: "new york",
    creator: "u1",
  },
];
let myCoordinates = {
  lat: 40.7484474,
  lng: -73.9871516,
};
// middleware Functions
// const getPlaceById = function (){}
// const getPlaceById => (){}
async function getPlaceById(req, res, next) {
  const placeId = req.params.pid; // { pid: 'p1' }
  let places;
  try {
    places = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, couldn't find the id",
      500
    );
    return next(error);
  }
  if (!places) {
    throw new HttpError("Could not find the place for the given id", 404);
  }
  res.status(200).json({ places: places.toObject({ getters: true }) });
}

async function getPlacesByUserId(req, res, next) {
  const userId = req.params.uid; // { pid: 'p1' }
  // let places;
  // places = await Place.find({ creator: userId });
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (e) {
    const error = new HttpError(
      "Something went wrong, couldn't find the id",
      500
    );
    return next(error);
  }
  if (!userWithPlaces || !userWithPlaces.places) {
    return next(
      new HttpError("Could not find places for the given user ID.", 404)
    );
  }
  res.status(200).json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
}

async function createPlace(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { title, description, address, creator } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: myCoordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (e) {
    return next(new HttpError("Creating place failed, please try again", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id", 404));
  }
  console.log(user);
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (e) {
    const error = new HttpError("creating Place failed", 500);
    return next(error);
  }
  res.status(201).json(createdPlace);
}

async function updatePlaceById(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { title, description } = req.body;

  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (e) {
    const error = new HttpError("something went wrong", 500);
    return next(error);
  }

  place.title = title;

  place.description = description;

  try {
    await place.save();
  } catch (e) {
    const error = new HttpError("failed to save place", 500);
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
}

async function deletePlaceById(req, res, next) {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (e) {
    return next(new HttpError("Something went wrong", 500));
  }

  if (!place) {
    return next(new HttpError("Place not found", 404));
  }

  // Construct absolute path for the image
  const imagePath = path.join(__dirname, "..", place.image);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction(); // Ensure transaction is committed

    // Ensure the file exists before deleting
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
    } else {
      console.log("File does not exist:", imagePath);
    }
  } catch (e) {
    return next(new HttpError("Something went wrong, cannot delete", 500));
  }

  res.status(200).json({ message: "Place Deleted Successfully" });
}

// function exporting
exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;
