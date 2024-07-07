import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
const stripePromise = loadStripe(
    "pk_test_51MWWzxSAs7MGZLJbuGFbqlav9c1Nivv5QaBjus24KWKTTcFkNldmezLxMva6ib1wc0NK7M4r94ySOZGG5t5r01Em0072GzoB25"
);
import { toast } from "react-hot-toast";

const CheckoutForm = ({
    setAuth,
    isAuth,
    setManualNavToSubscribe,
    user,
    setUser,
}) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState("monthly");
    const [name, setName] = useState("");
    const [address, setAddress] = useState({
        line1: "",
        city: "",
        postal_code: "",
        state: "",
        country: "IN",
    });

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
            setError(error.message);
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
                    name,
                    address,
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
                    setError(`Payment failed: ${stripeError.message}`);
                } else {
                    // Payment succeeded, update the subscription status

                    const updateResponse = await axios.post(
                        "api/subscription/subscribe/update",
                        {
                            subscriptionId: response.data.subscriptionId,
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
                        });
                        navigate("/subscribe");
                    } else {
                        setError(
                            `Subscription update failed: ${updateResult.message}`
                        );
                        toast.error("Error creating subscription", {
                            id: loadingId,
                        });
                    }
                }
            } else {
                setError(
                    `Subscription creation failed: ${response.data.message}`
                );
                toast.error("Error creating subscription", { id: loadingId });
            }
        } catch (err) {
            setError("Subscription failed: " + err.message);
            toast.error("Error creating subscription", { id: loadingId });
        }
        setLoading(false);
    };

    return (
        <>
            {isAuth && <Logout />}
            <form onSubmit={handleSubmit}>
                <CardElement />
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Address Line 1</label>
                    <input
                        type="text"
                        value={address.line1}
                        onChange={(e) =>
                            setAddress({ ...address, line1: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <label>City</label>
                    <input
                        type="text"
                        value={address.city}
                        onChange={(e) =>
                            setAddress({ ...address, city: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <label>Postal Code</label>
                    <input
                        type="text"
                        value={address.postal_code}
                        onChange={(e) =>
                            setAddress({
                                ...address,
                                postal_code: e.target.value,
                            })
                        }
                        required
                    />
                </div>
                <div>
                    <label>State</label>
                    <input
                        type="text"
                        value={address.state}
                        onChange={(e) =>
                            setAddress({ ...address, state: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <label>Country</label>
                    <input
                        type="text"
                        value={address.country}
                        onChange={(e) =>
                            setAddress({ ...address, country: e.target.value })
                        }
                        required
                    />
                </div>

                <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
                {error && <div>{error}</div>}
                <button type="submit" disabled={!stripe || loading}>
                    {"Subscribe"}
                </button>
            </form>
        </>
    );
};

const Subscription = ({
    setAuth,
    isAuth,
    setManualNavToSubscribe,
    user,
    setUser,
}) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm
                setAuth={setAuth}
                isAuth={isAuth}
                setManualNavToSubscribe={setManualNavToSubscribe}
                user={user}
                setUser={setUser}
            />
        </Elements>
    );
};

export default Subscription;
