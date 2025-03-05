const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");
router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").notEmpty().isLength({ min: 6 }),
  ],
  usersController.signUp
);

router.post("/login", usersController.logIn);

module.exports = router;
