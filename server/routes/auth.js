const express = require("express");
const router = express.Router();
const {
    register,
    login,
    userDetails,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, userDetails);

module.exports = router;
