//run this file seperately bu command node seed/plan.js to insert the data into db
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Plan = require("../models/Plan");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const plans = [
    {
        name: "Basic",
        monthlyPrice: 100,
        yearlyPrice: 1000,
        videoQuality: "Good",
        resolution: "480p",
        devices: "Phone",
        activeScreens: 1,
    },
    {
        name: "Standard",
        monthlyPrice: 200,
        yearlyPrice: 2000,
        videoQuality: "Good",
        resolution: "720P",
        devices: "Phone+Tablet",
        activeScreens: 3,
    },
    {
        name: "Premium",
        monthlyPrice: 500,
        yearlyPrice: 5000,
        videoQuality: "Better",
        resolution: "1080P",
        devices: "Phone+Tablet+Computer",
        activeScreens: 5,
    },
    {
        name: "Regular",
        monthlyPrice: 700,
        yearlyPrice: 7000,
        videoQuality: "Best",
        resolution: "4K+HDR",
        devices: "Phone+Tablet+TV",
        activeScreens: 10,
    },
];

Plan.insertMany(plans)
    .then(() => {
        console.log("Plans added");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
        mongoose.connection.close();
    });
