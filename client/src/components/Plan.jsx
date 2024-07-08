import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/planStyles.css";
import {
    Typography,
    Box,
    Table,
    TableCell,
    TableHead,
    TableBody,
    TableRow,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    TableContainer,
    useMediaQuery,
    Grid,
} from "@mui/material";

const Plan = ({ setSelectedPlan, setManualNavToSubscribe }) => {
    const [plans, setPlans] = useState([]);
    const [billingPeriod, setBillingPeriod] = useState("monthly");
    const [currentSelectedPlan, setCurrentSelectedPlan] = useState("Basic");
    const [price, setPrice] = useState(100);
    const navigate = useNavigate();

    console.log(plans);

    useEffect(() => {
        setSelectedPlan({
            name: currentSelectedPlan,
            billingCycle: billingPeriod,
            price: price,
        });
    }, [billingPeriod, price, currentSelectedPlan, setSelectedPlan]);

    //just fetching plan data from the database
    useEffect(() => {
        axios
            .get("/api/plans")
            .then((response) => {
                //sorting the array
                const sortedPlan = [...response.data].sort(
                    (a, b) => a.monthlyPrice - b.monthlyPrice
                );
                setPlans(sortedPlan);
            })
            .catch((error) => {
                console.error("There was an error fetching the plans!", error);
            });
    }, []);

    const handlePlanSelect = (planName) => {
        setCurrentSelectedPlan(planName);
    };

    const handlePrice = (price) => {
        setPrice(price);
    };

    const handleNext = () => {
        const data = {
            name: currentSelectedPlan,
            billingCycle: billingPeriod,
            price: price,
        };
        localStorage.getItem("token")
            ? localStorage.setItem("selectedPlan", JSON.stringify(data))
            : sessionStorage.setItem("selectedPlan", JSON.stringify(data));

        setManualNavToSubscribe(false);
        navigate("/checkout");
    };

    const isLargeScreen = useMediaQuery("(min-width: 700px)");
    //const isSmallScreen = useMediaQuery("(max-width: 425px)");

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            overflow="auto"

            //pt={isSmallScreen ? "6rem" : "auto"}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography
                    variant={isLargeScreen ? "h5" : "h6"}
                    data-aos="fade-down"
                    data-aos-duration="1000"
                    gutterBottom
                >
                    Choose the right plan for you
                </Typography>
                <ToggleButtonGroup
                    value={billingPeriod}
                    color="primary"
                    onChange={() => {
                        billingPeriod == "monthly"
                            ? setBillingPeriod("yearly")
                            : setBillingPeriod("monthly");
                    }}
                    exclusive
                    data-aos="fade-down"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                >
                    <ToggleButton value="monthly">Monthly</ToggleButton>
                    <ToggleButton value="yearly">Yearly</ToggleButton>
                </ToggleButtonGroup>

                {isLargeScreen ? (
                    <TableContainer
                        data-aos="zoom-in-up"
                        data-aos-delay="300"
                        data-aos-duration="1000"
                    >
                        <Table className="plans-table">
                            <TableHead>
                                <TableRow className="plans-row">
                                    <TableCell></TableCell>
                                    {plans?.map((plan) => (
                                        <TableCell
                                            key={plan._id}
                                            className={`plan-card ${
                                                currentSelectedPlan ===
                                                plan.name
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                handlePlanSelect(plan.name);
                                                handlePrice(
                                                    billingPeriod === "monthly"
                                                        ? plan.monthlyPrice
                                                        : plan.yearlyPrice
                                                );
                                            }}
                                        >
                                            {" "}
                                            {plan.name}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        sx={{ borderBottomWidth: 0, mr: 2 }}
                                    >
                                        Price
                                    </TableCell>
                                    {plans?.map((plan) => (
                                        <TableCell
                                            key={plan._id}
                                            className={`plan-card ${
                                                currentSelectedPlan ===
                                                plan.name
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            sx={{ borderBottomWidth: 0 }}
                                        >
                                            ₹{" "}
                                            {billingPeriod === "monthly"
                                                ? plan.monthlyPrice
                                                : plan.yearlyPrice}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottomWidth: 0 }}>
                                        Video Quality
                                    </TableCell>
                                    {plans?.map((plan) => (
                                        <TableCell
                                            key={plan._id}
                                            className={`plan-card ${
                                                currentSelectedPlan ===
                                                plan.name
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            sx={{ borderBottomWidth: 0 }}
                                        >
                                            {plan.videoQuality}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottomWidth: 0 }}>
                                        Resolution
                                    </TableCell>
                                    {plans?.map((plan) => (
                                        <TableCell
                                            key={plan._id}
                                            className={`plan-card ${
                                                currentSelectedPlan ===
                                                plan.name
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            sx={{ borderBottomWidth: 0 }}
                                        >
                                            {plan.resolution}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottomWidth: 0 }}>
                                        Active Screens
                                    </TableCell>
                                    {plans?.map((plan) => (
                                        <TableCell
                                            key={plan._id}
                                            className={`plan-card ${
                                                currentSelectedPlan ===
                                                plan.name
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            sx={{ borderBottomWidth: 0 }}
                                        >
                                            {plan.activeScreens}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ borderBottomWidth: 0 }}>
                                        Devices
                                    </TableCell>
                                    {plans?.map((plan) => (
                                        <TableCell
                                            key={plan._id}
                                            className={`plan-card ${
                                                currentSelectedPlan ===
                                                plan.name
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            sx={{ borderBottomWidth: 0 }}
                                        >
                                            {plan.devices}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Grid container justifyContent="center" mt={2} spacing={1}>
                        {plans?.map((plan) => (
                            <Grid
                                key={plan._id}
                                item
                                className={`plan-card ${
                                    currentSelectedPlan === plan.name
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {
                                    handlePlanSelect(plan.name);
                                    handlePrice(
                                        billingPeriod === "monthly"
                                            ? plan.monthlyPrice
                                            : plan.yearlyPrice
                                    );
                                }}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                border="1px solid #d9d9d9"
                                borderRadius={2}
                                m="2px"
                                ml={5}
                                mr={5}
                                xs={12}
                            >
                                <Typography fontWeight={500}>
                                    {plan.name}
                                </Typography>
                                <Typography fontSize="0.87rem">
                                    ₹{" "}
                                    {billingPeriod === "monthly"
                                        ? plan.monthlyPrice
                                        : plan.yearlyPrice}
                                </Typography>
                                <Typography fontSize="0.87rem">
                                    {plan.resolution}
                                </Typography>
                                <Typography fontSize="0.87rem">
                                    {plan.activeScreens}
                                </Typography>
                                <Typography fontSize="0.87rem">
                                    {plan.devices}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Button
                    type="button"
                    variant="contained"
                    onClick={handleNext}
                    sx={{ marginTop: "15px" }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default Plan;

// <div className="plan-selection">
//     <h2>Choose the right plan for you</h2>
//     <div className="billing-toggle">
//         <button
//             className={billingPeriod === "monthly" ? "active" : ""}
//             onClick={() => {
//                 handleBillingToggle("monthly");
//                 handlePrice(price / 10);
//             }}
//         >
//             Monthly
//         </button>
//         <button
//             className={billingPeriod === "yearly" ? "active" : ""}
//             onClick={() => {
//                 handleBillingToggle("yearly");
//                 handlePrice(price * 10);
//             }}
//         >
//             Yearly
//         </button>
//     </div>
//     <div className="plans-table">
//         <div className="plans-row heading">
//             <div className="plan-details">Details</div>
//             {plans.map((plan) => (
//                 <div
//                     key={plan.name}
// className={`plan-card ${
//     currentSelectedPlan === plan.name
//         ? "selected"
//         : ""
// }`}
// onClick={() => {
//     handlePlanSelect(plan.name);
//     handlePrice(
//         billingPeriod === "monthly"
//             ? plan.monthlyPrice
//             : plan.yearlyPrice
//     );
// }}
//                 >
//                     {plan.name}
//                 </div>
//             ))}
//         </div>
//         <div className="plans-row">
//             <div className="plan-details">Price</div>
//             {plans.map((plan) => (
//                 <div
//                     key={plan.name}
// className={`plan-card ${
//     currentSelectedPlan === plan.name
//         ? "selected"
//         : ""
// }`}
//                 >
//                     ₹{" "}
//                     {billingPeriod === "monthly"
//                         ? plan.monthlyPrice
//                         : plan.yearlyPrice}
//                 </div>
//             ))}
//         </div>
//         <div className="plans-row">
//             <div className="plan-details">Video Quality</div>
//             {plans.map((plan) => (
//                 <div
//                     key={plan.name}
//                     className={`plan-card ${
//                         currentSelectedPlan === plan.name
//                             ? "selected"
//                             : ""
//                     }`}
//                 >
//                     {plan.videoQuality}
//                 </div>
//             ))}
//         </div>
//         <div className="plans-row">
//             <div className="plan-details">Resolution</div>
//             {plans.map((plan) => (
//                 <div
//                     key={plan.name}
//                     className={`plan-card ${
//                         currentSelectedPlan === plan.name
//                             ? "selected"
//                             : ""
//                     }`}
//                 >
//                     {plan.resolution}
//                 </div>
//             ))}
//         </div>
//         <div className="plans-row">
//             <div className="plan-details">Devices</div>
//             {plans.map((plan) => (
//                 <div
//                     key={plan.name}
//                     className={`plan-card ${
//                         currentSelectedPlan === plan.name
//                             ? "selected"
//                             : ""
//                     }`}
//                 >
//                     {plan.devices}
//                 </div>
//             ))}
//         </div>
//         <div className="plans-row">
//             <div className="plan-details">Number of Screens</div>
//             {plans.map((plan) => (
//                 <div
//                     key={plan.name}
//                     className={`plan-card ${
//                         currentSelectedPlan === plan.name
//                             ? "selected"
//                             : ""
//                     }`}
//                 >
//                     {plan.activeScreens}
//                 </div>
//             ))}
//         </div>
//     </div>
//     <button className="next-button" onClick={handleNext}>
//         Next
//     </button>
// </div>
