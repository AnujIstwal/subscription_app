const express = require("express");
const router = express.Router();
const Plan = require("../models/Plan");

router.get("/", async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
