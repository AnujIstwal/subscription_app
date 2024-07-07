import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "./Spinner";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Button,
    Box,
} from "@mui/material";

const Dashboard = ({ user, setUser, setManualNavToSubscribe }) => {
    const [subscription, setSubscription] = useState(user);
    const navigate = useNavigate();

    useEffect(() => {
        setSubscription(user);
    }, [user, subscription]);

    //extracting the plan name only
    const basePlan = subscription?.subscription?.plan.split(" ");

    const devices = {
        Basic: "Phone",
        Standard: "Phone+Tablet",
        Premium: "Phone+Tablet+Computer",
        Regular: "Phone+Tablet+TV",
    };

    const cancelHandler = async () => {
        const cancelLoadId = toast.loading("Cancelling ...");
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");
            const response = await axios.post(
                "/api/subscription/cancel",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "canceled") {
                toast.success("Subscription canceled successfully", {
                    id: cancelLoadId,
                });
                setSubscription({
                    ...user,
                    subscription: { ...user.subscription, status: "canceled" },
                });
                setUser({
                    ...user,
                    subscription: { ...user.subscription, status: "canceled" },
                });
            }
        } catch (error) {
            console.log("Error while Canceling :", error.response.data);
            toast.error("Error canceling subscription", { id: cancelLoadId });
        }
    };

    if (!subscription) {
        return <Spinner />;
    }

    const handleNewPlan = () => {
        setManualNavToSubscribe(true);
        navigate("/plans");
    };

    const chipStyle = {
        textTransform: "capitalize",
        borderRadius: "8px",
        fontSize: "0.8rem",
        fontWeight: 600,
        height: "auto",
        py: 0.5,
    };

    return (
        <Card
            sx={{ maxWidth: 500, borderRadius: 8, p: 1 }}
            variant="outlined"
            data-aos="flip-left"
        >
            <CardContent>
                <Box>
                    <Box
                        display="inline-flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                    >
                        <Typography fontSize="1.3rem" fontWeight={500}>
                            Current Plan Details
                        </Typography>
                        <Chip
                            label={subscription.subscription.status}
                            sx={
                                subscription.subscription.status === "active"
                                    ? {
                                          ...chipStyle,
                                          bgcolor: "#b3e0ff",
                                          color: "#0044cc",
                                      }
                                    : {
                                          ...chipStyle,
                                          bgcolor: "#ffe6e6",
                                          color: "#ff6666",
                                      }
                            }
                        />
                    </Box>
                    {/* {isAuth && <Logout />} */}
                </Box>

                <Typography fontWeight={500} color="text.secondary" mt={1}>
                    {basePlan[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {devices[basePlan[0]]}
                </Typography>

                <Typography variant="h4" fontWeight={500} mt={2}>
                    ₹ {subscription.subscription.price}/
                    {subscription.subscription.billingInterval === "monthly"
                        ? "mo"
                        : "yr"}
                </Typography>

                <CardActions sx={{ p: 0, pt: 2 }}>
                    {subscription?.subscription?.status === "active" ? (
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                            onClick={cancelHandler}
                        >
                            Cancel Plan
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem" }}
                            onClick={handleNewPlan}
                        >
                            New Plan
                        </Button>
                    )}
                </CardActions>

                <Box bgcolor="#f2f2f2" mt={2} p={0.5} borderRadius={2}>
                    {subscription.subscription.status === "active" ? (
                        <Typography variant="caption">
                            Your subscription has started on{" "}
                            <strong>
                                {new Date(
                                    subscription.subscription.startDate
                                ).toLocaleDateString()}
                            </strong>{" "}
                            and will auto renew on{" "}
                            <strong>
                                {new Date(
                                    subscription.subscription.endDate
                                ).toLocaleDateString()}
                            </strong>
                        </Typography>
                    ) : (
                        <Typography variant="caption">
                            Your subscription has been canceled and you will
                            loose access to the services on{" "}
                            <strong>
                                {new Date(
                                    subscription.subscription.endDate
                                ).toLocaleDateString()}
                            </strong>
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default Dashboard;

// <div>
//     {isAuth && <Logout />}
//     <h1>Dashboard</h1>
//     <p>
//         <strong>Plan:</strong> {basePlan[0]}
//     </p>
//     <p>
//         <strong>Devices:</strong> {devices[basePlan[0]]}
//     </p>
//     <p>
//         <strong>Price:</strong> ₹ {subscription.subscription.price}/
//         {subscription.subscription.billingInterval === "monthly"
//             ? "mo"
//             : "yr"}
//     </p>
//     <p>
//         <strong>Status:</strong> {subscription.subscription.status}
//     </p>
//     {subscription?.subscription?.status === "active" ? (
//         <button type="button" onClick={cancelHandler}>
//             Cancel
//         </button>
//     ) : (
//         <button type="button" onClick={handleNewPlan}>
//             Plan
//         </button>
//     )}
//     {subscription.subscription.status === "active" ? (
// <p>
//     Your subscription has started on{" "}
//     <strong>
//         {new Date(
//             subscription.subscription.startDate
//         ).toLocaleDateString()}
//     </strong>{" "}
//     and will auto renew on{" "}
//     <strong>
//         {new Date(
//             subscription.subscription.endDate
//         ).toLocaleDateString()}
//     </strong>
// </p>
//     ) : (
//         <p>
//             Your subscription has been canceled and you will loose
//             access to the services on{" "}
//             <strong>
//                 {new Date(
//                     subscription.subscription.endDate
//                 ).toLocaleDateString()}
//             </strong>
//         </p>
//     )}
// </div>
