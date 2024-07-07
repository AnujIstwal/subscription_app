import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    CardElement,
    useStripe,
    useElements,
    Elements,
} from "@stripe/react-stripe-js";

import { Box, Typography, Button, Paper, useMediaQuery } from "@mui/material";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
//import "../styles/checkoutStyles.css";

const stripePromise = loadStripe(
    "pk_test_51MWWzxSAs7MGZLJbuGFbqlav9c1Nivv5QaBjus24KWKTTcFkNldmezLxMva6ib1wc0NK7M4r94ySOZGG5t5r01Em0072GzoB25"
);

const CheckoutForm = ({
    setSelectedPlan,
    selectedPlan,
    setAuth,
    setManualNavToSubscribe,
    user,
    setUser,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const plan = selectedPlan?.name + " " + selectedPlan?.billingCycle;

    useEffect(() => {
        const data =
            localStorage.getItem("selectedPlan") ||
            sessionStorage.getItem("selectedPlan");

        if (data) {
            setSelectedPlan(JSON.parse(data));
        }
    }, [setSelectedPlan]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const loadingId = toast.loading("Subscribing... ");

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            toast.error("Subscription Failed", { id: loadingId });
            setLoading(false);
            return;
        }

        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            const response = await axios.post(
                "/api/subscription/subscribe",
                {
                    paymentMethodId: paymentMethod.id,
                    plan,
                    name: user.userName,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                console.log(
                    "Subscription created successfully:",
                    response.data
                );
                setAuth(true);
            } else if (response.data.requiresAction) {
                const { error: stripeError } = await stripe.confirmCardPayment(
                    response.data.paymentIntentClientSecret
                );
                if (stripeError) {
                    toast.error("Payment Failed", { id: loadingId });
                } else {
                    // Payment succeeded, update the subscription status

                    const updateResponse = await axios.post(
                        "api/subscription/subscribe/update",
                        {
                            subscriptionId: response.data.subscriptionId,
                            plan: plan,
                        },
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const updateResult = await updateResponse.data;
                    if (updateResult.success) {
                        console.log("Subscription and payment successful");

                        if (user) {
                            setUser({
                                ...user,
                                subscription: updateResult.subscription,
                            });
                        }

                        setManualNavToSubscribe(false);
                        // Redirect to dashboard or show success message
                        toast.success("Subscription successful", {
                            id: loadingId,
                            duration: 4000,
                        });
                        navigate("/plans");
                    } else {
                        toast.error("Error creating subscription", {
                            id: loadingId,
                        });
                    }
                }
            } else {
                toast.error("Error creating subscription", { id: loadingId });
            }
        } catch (err) {
            toast.error("Error creating subscription", { id: loadingId });
        }
        setLoading(false);
    };

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
            },
        },
    };

    const isSmallScreen = useMediaQuery("(max-width: 500px)");

    return (
        <Box
            component={Paper}
            display="flex"
            flexDirection={isSmallScreen ? "column-reverse" : "row"}
            borderRadius={5}
            variant="outlined"
            maxWidth="650px"
            data-aos="fade-right"
            data-aos-duration="500"
        >
            <Box height="80%" p={4}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="h5" fontWeight={500}>
                        Complete Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                        Enter your credit or debit card details below
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} mt={4}>
                        <Box border="0.5px solid #e3e3e3" p={1}>
                            <CardElement options={cardStyle} />
                        </Box>
                        <Button
                            type="submit"
                            disabled={!stripe || loading}
                            sx={{ mt: 3 }}
                            variant="contained"
                        >
                            {loading ? "Processing..." : "Confirm Payment"}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box
                height="auto"
                bgcolor="#f2f2f2"
                p={4}
                sx={
                    isSmallScreen
                        ? {
                              borderBottomRightRadius: 0,
                              borderBottomLeftRadius: 0,
                              borderTopLeftRadius: "inherit",
                              borderTopRightRadius: "inherit",
                          }
                        : {
                              borderTopRightRadius: "inherit",
                              borderBottomRightRadius: "inherit",
                              borderBottomLeftRadius: 0,
                              borderTopLeftRadius: 0,
                          }
                }
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-start"
                    height="100%"
                    fontWeight={300}
                >
                    <Typography variant="h6" align="left" fontWeight={500}>
                        Order Summary
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        mt={4}
                        gap={10}
                    >
                        <Typography variant="body2" fontSize="0.8rem">
                            Plan Name
                        </Typography>
                        <Typography
                            variant="body2"
                            fontSize="0.8rem"
                            fontWeight={500}
                        >
                            {selectedPlan.name}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        borderTop="1px solid #d9d9d9"
                        mt={1}
                        pt={1}
                        gap={10}
                    >
                        <Typography variant="body2" fontSize="0.8rem">
                            Billing Cycle
                        </Typography>
                        <Typography
                            variant="body2"
                            fontSize="0.8rem"
                            textTransform="capitalize"
                            fontWeight={500}
                        >
                            {selectedPlan.billingCycle}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        borderTop="1px solid #d9d9d9"
                        mt={1}
                        pt={1}
                        gap={10}
                    >
                        <Typography variant="body2" fontSize="0.8rem">
                            Plan Price
                        </Typography>
                        <Typography
                            variant="body2"
                            fontSize="0.8rem"
                            fontWeight={500}
                        >
                            ₹ {selectedPlan.price}/
                            {selectedPlan.billingCycle === "monthly"
                                ? "mo"
                                : "yr"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const Checkout = ({
    selectedPlan,
    setSelectedPlan,
    setAuth,
    setManualNavToSubscribe,
    user,
    setUser,
}) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                setAuth={setAuth}
                setManualNavToSubscribe={setManualNavToSubscribe}
                user={user}
                setUser={setUser}
            />
        </Elements>
    );
};
export default Checkout;

// <div className="checkout-container">
//     <div className="payment-form">
//         <h2>Complete Payment</h2>
//         <p>
//             <small>Enter your credit or debit card details below</small>
//         </p>
//         <form onSubmit={handleSubmit}>
//             <CardElement className="card-ele" />
//             <button type="submit" disabled={!stripe || loading}>
//                 {loading ? "Processing..." : "Confirm Payment"}
//             </button>
//         </form>
//     </div>
//     <div className="order-summary">
//         <h2>Order Summary</h2>
//         <p>
//             <strong>Plan Name:</strong> {selectedPlan.name}
//         </p>
//         <p>
//             <strong>Billing Cycle:</strong> {selectedPlan?.billingCycle}
//         </p>
//         <p>
//             <strong>Plan Price:</strong> ₹ {selectedPlan.price}/
//             {selectedPlan.billingCycle === "monthly" ? "mo" : "yr"}
//         </p>
//     </div>
// </div>
