const express = require("express");
const fs = require("fs");
const router = express.Router();
const { check } = require("express-validator");
const placesControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
router.get("/:pid", placesControllers.getPlaceById);

router.get("/users/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  [check("title").notEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlaceById
);
router.delete("/:pid", placesControllers.deletePlaceById);

module.exports = router;
