const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authmiddleware");
const {
    subscribe,
    updateSubscription,
    cancelSubscription,
    subscriptionDetails,
} = require("../controllers/subscriptionController");

router.post("/subscribe", authMiddleware, subscribe);
router.post("/subscribe/update", authMiddleware, updateSubscription);
router.post("/cancel", authMiddleware, cancelSubscription);
router.get("/details", authMiddleware, subscriptionDetails);

module.exports = router;
