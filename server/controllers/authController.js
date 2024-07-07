const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.userDetails = async (req, res) => {
    const userEmail = req.user.userEmail;

    try {
        const user = await User.findOne({ email: userEmail });
        res.json(user);
    } catch (error) {
        res.json(`Error : ${error.message}`);
    }
};

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(400).send("Error registering user: " + error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        //     expiresIn: "1h",
        // });
        const token = jwt.sign(
            { userId: user._id, userEmail: user.email },
            process.env.JWT_SECRET
        );
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).send("Error logging in: " + error.message);
    }
};
