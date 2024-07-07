const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
    name: String,
    monthlyPrice: Number,
    yearlyPrice: Number,
    videoQuality: String,
    resolution: String,
    devices: String,
    activeScreens: Number,
});

module.exports = mongoose.model("Plan", PlanSchema);
