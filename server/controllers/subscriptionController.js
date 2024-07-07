const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe");
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

exports.subscribe = async (req, res) => {
    const { paymentMethodId, plan, name } = req.body;
    const email = req.user.userEmail;

    const productIds = {
        "Basic monthly": "price_1PVs1VSAs7MGZLJbUGDVQEn9",
        "Basic yearly": "price_1PVs2ISAs7MGZLJb6Cd1UEnb",
        "Standard monthly": "price_1PVs34SAs7MGZLJbmk07Cx3I",
        "Standard yearly": "price_1PVs3dSAs7MGZLJbOJLhJAQV",
        "Premium monthly": "price_1PVs4sSAs7MGZLJbC8muwQGb",
        "Premium yearly": "price_1PVs5RSAs7MGZLJbXypTXcyV",
        "Regular monthly": "price_1PVs68SAs7MGZLJbk2uSCDqM",
        "Regular yearly": "price_1PVs7cSAs7MGZLJbnFF8REE8",
    };

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //checking the customer
        let customer;
        if (user.subscription.stripeCustomerId) {
            customer = await stripeInstance.customers.retrieve(
                user.subscription.stripeCustomerId
            );
        } else {
            customer = await stripeInstance.customers.create({
                email: user.email,
                name: name,
                payment_method: paymentMethodId,
                invoice_settings: { default_payment_method: paymentMethodId },
            });
            user.subscription.stripeCustomerId = customer.id;
            await user.save();
        }

        const priceId = productIds[plan];

        const subscription = await stripeInstance.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            expand: ["latest_invoice.payment_intent"],
        });

        // Handle the payment intent if required
        const paymentIntent = subscription.latest_invoice.payment_intent;
        if (
            paymentIntent.status === "requires_action" ||
            paymentIntent.status === "requires_payment_method"
        ) {
            return res.json({
                success: false,
                requiresAction: true,
                paymentIntentClientSecret: paymentIntent.client_secret,
                subscriptionId: subscription.id,
            });
        } else if (paymentIntent.status === "succeeded") {
            user.subscription.stripeCustomerId = customer.id;
            user.subscription.stripeSubscriptionId = subscription.id;
            user.subscription.plan = plan;
            user.subscription.price =
                subscription.items.data[0].price.unit_amount / 100;
            user.subscription.billingInterval =
                plan.search("monthly") > 0 ? "monthly" : "yearly";

            user.subscription.startDate = new Date();
            user.subscription.endDate = new Date(
                new Date().setFullYear(
                    new Date().getFullYear() +
                        (plan.search("monthly") > 0 ? 0 : 1)
                )
            );
            user.subscription.status = "active";

            await user.save();
            res.json({ success: true, subscriptionId: subscription.id, plan });
        } else {
            return res.status(500).json({
                message: "Failed to create subscription",
                error: "Unexpected payment intent status",
            });
        }
    } catch (error) {
        console.error("Subscription creation failed:", error);
        res.status(500).json({
            message: "Subscription creation failed",
            error: error.message,
        });
    }
};

// Update subscription after payment confirmation
exports.updateSubscription = async (req, res) => {
    const { subscriptionId, plan } = req.body;
    const email = req.user.userEmail;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const subscription = await stripeInstance.subscriptions.retrieve(
            subscriptionId
        );

        if (subscription.status === "active") {
            user.subscription.plan = plan;
            (user.subscription.status = "active"),
                (user.subscription.billingInterval =
                    subscription.items.data[0].plan.interval === "month"
                        ? "monthly"
                        : "yearly");
            user.subscription.startDate = new Date(
                subscription.start_date * 1000
            ); // Convert from Unix timestamp
            user.subscription.endDate = new Date(
                subscription.current_period_end * 1000
            ); // Convert from Unix timestamp
            user.subscription.stripeSubscriptionId = subscription.id;
            user.subscription.price =
                subscription.items.data[0].price.unit_amount / 100;
            await user.save();

            res.json({
                success: true,
                message: "Subscription updated successfully",
                subscription: {
                    plan: user.subscription.plan,
                    status: "active",
                    price: user.subscription.price,
                    billingInterval: user.subscription.billingInterval,
                    startDate: user.subscription.startDate,
                    endDate: user.subscription.endDate,
                    stripeSubscriptionId:
                        user.subscription.stripeSubscriptionId,
                    stripeCustomerId: user.subscription.stripeCustomerId,
                },
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Subscription is not active",
            });
        }
    } catch (error) {
        console.error("Subscription update failed:", error);
        res.status(500).json({
            message: "Subscription update failed",
            error: error.message,
        });
    }
};

//cancel subscription
exports.cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        const subscriptionId = user.subscription.stripeSubscriptionId;
        const subscription = await stripeInstance.subscriptions.cancel(
            subscriptionId
        );

        user.subscription.status = "canceled";
        await user.save();

        res.json(subscription);
    } catch (error) {
        console.error("Subscription cancelation failed:", error);
        res.status(500).json({
            message: "Subscription cancelation failed",
            error: error.message,
        });
    }
};

//fetching the details of the user

exports.subscriptionDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); //jwt decoded value
        if (!user || !user.subscription.stripeSubscriptionId) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        const subscription = await stripeInstance.subscriptions.retrieve(
            user.subscription.stripeSubscriptionId
        );

        res.json({
            plan: user.subscription.plan,
            status: subscription.status,
            current_period_end: new Date(
                subscription.current_period_end * 1000
            ),
            price: subscription.items.data[0].plan.amount / 100,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching subscription details",
            error: error.message,
        });
    }
};
