import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ isAuth, setUser }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get("/api/auth/user", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUser(response.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        if (isAuth) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [isAuth, setUser]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
