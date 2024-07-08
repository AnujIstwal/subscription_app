import { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    Navigate,
} from "react-router-dom";
import Registration from "./components/Registration";
import Login from "./components/Login";
//import Subscription from "./components/Subscription";
import Dashboard from "./components/Dashboard";
import Plan from "./components/Plan";
import Checkout from "./components/Checkout";
import Logout from "./components/Logout";

import axios from "axios";
import { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";

import AOS from "aos";
import "aos/dist/aos.css";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const Main = () => {
    const [isAuth, setAuth] = useState(
        !!localStorage.getItem("token") || !!sessionStorage.getItem("token")
    );
    const [manualNavToSubscribe, setManualNavToSubscribe] = useState(false);
    const [user, setUser] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState({
        name: null,
        billingCycle: null,
        price: null,
    });

    const navigate = useNavigate();
    const path = window.location.pathname;

    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuth) {
                const token =
                    localStorage.getItem("token") ||
                    sessionStorage.getItem("token");
                try {
                    const response = await axios.get("/api/auth/user", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    setAuth(false);
                }
            }
        };
        fetchUserData();
    }, [isAuth]);

    useEffect(() => {
        if (isAuth && user) {
            const currentPath = window.location.pathname;

            if (manualNavToSubscribe && currentPath === "/plans") return;
            if (!manualNavToSubscribe && currentPath === "/checkout") return;

            if (
                user.subscription.status === "canceled" ||
                user.subscription.status === "active"
            ) {
                navigate("/dashboard");
            } else if (user.subscription.status === "free") {
                navigate("/plans");
            }
        }
    }, [isAuth, user, navigate, manualNavToSubscribe]);

    console.log({
        user: user,
        isAuth: isAuth,
        switch: manualNavToSubscribe,
        selectedPlan: selectedPlan,
    });

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <>
            <Box
                width="100vw"
                height="100vh"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                bgcolor={path === "/plans" ? "#fff" : "primary.main"}
            >
                {isAuth && <Logout />}
                <Routes>
                    {/* Redirect any undefined route to /dashboard if authenticated */}
                    {isAuth ? (
                        <>
                            {/* <Route
                            path="/subscribe"
                            element={
                                <Subscription
                                    setAuth={setAuth}
                                    user={user}
                                    isAuth={isAuth}
                                    setManualNavToSubscribe={
                                        setManualNavToSubscribe
                                    }
                                    setUser={setUser}
                                />
                            }
                        /> */}
                            <Route
                                path="/dashboard"
                                element={
                                    <Dashboard
                                        user={user}
                                        isAuth={isAuth}
                                        setUser={setUser}
                                        setManualNavToSubscribe={
                                            setManualNavToSubscribe
                                        }
                                    />
                                }
                            />
                            <Route
                                path="/plans"
                                element={
                                    <Plan
                                        setSelectedPlan={setSelectedPlan}
                                        setManualNavToSubscribe={
                                            setManualNavToSubscribe
                                        }
                                    />
                                }
                            />
                            <Route
                                path="*"
                                element={<Navigate to="/dashboard" />}
                            />
                            <Route
                                path="/checkout"
                                element={
                                    <Checkout
                                        selectedPlan={selectedPlan}
                                        setSelectedPlan={setSelectedPlan}
                                        setAuth={setAuth}
                                        user={user}
                                        isAuth={isAuth}
                                        setManualNavToSubscribe={
                                            setManualNavToSubscribe
                                        }
                                        setUser={setUser}
                                    />
                                }
                            />
                        </>
                    ) : (
                        <>
                            <Route
                                path="/login"
                                element={<Login setAuth={setAuth} />}
                            />
                            <Route
                                path="/register"
                                element={<Registration />}
                            />
                            <Route
                                path="*"
                                element={<Navigate to="/login" />}
                            />
                        </>
                    )}
                </Routes>
                {/* <Toaster position="top-center" toastOptions={{ duration: 5000 }} /> */}
                <Toaster position="top-center" />
            </Box>
        </>
    );
};

const App = () => (
    <Router>
        <Main />
    </Router>
);

export default App;
