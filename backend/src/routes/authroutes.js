const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authmiddleware");
const { register, login,profile } = require("../controllers/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);

module.exports = router;
