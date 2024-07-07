const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    subscription: {
        plan: {
            type: String,
            enum: [
                "free",
                "Basic monthly",
                "Basic yearly",
                "Standard monthly",
                "Standard yearly",
                "Premium monthly",
                "Premium yearly",
                "Regular monthly",
                "Regular yearly",
            ],
            default: "free",
        },
        status: {
            type: String,
            enum: ["active", "canceled", "free"],
            default: "free",
        },
        price: {
            type: Number,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        stripeCustomerId: {
            type: String,
        },
        stripeSubscriptionId: {
            type: String,
        },
        billingInterval: {
            type: String,
            enum: ["monthly", "yearly"],
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
