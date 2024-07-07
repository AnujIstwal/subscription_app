import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    useMediaQuery,
} from "@mui/material";

const Registration = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingId = toast.loading("Creating Account");

        setLoading(true);
        try {
            const response = await axios.post("/api/auth/register", formData);
            console.log("Registration successful:", response.data);
            toast.success("Registration successful", {
                id: loadingId,
                duration: 4000,
            });
            setLoading(false);
            navigate("/login");
        } catch (error) {
            console.error("Error registering user:", error.response.data);
            toast.error("Registration failed", { id: loadingId });
        }
        setLoading(false);
    };

    // Define the media query for screens less than 600px wide
    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            maxWidth="380px"
            width={isSmallScreen ? "90vw" : "40vw"}
            bgcolor="#fff"
            borderRadius="1.2rem"
            p="2rem"
            data-aos="fade-right"
            // data-aos-offset="300"
            // data-aos-easing="ease-in-sine"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                width="100%"
                maxWidth={400}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    align="center"
                    gutterBottom
                >
                    Create Account
                </Typography>
                <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Username"
                    margin="normal"
                    size="small"
                    fullWidth
                />

                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Email"
                    margin="normal"
                    size="small"
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Password"
                    margin="normal"
                    size="small"
                    fullWidth
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ bgcolor: "primary.main", mt: 3 }}
                    onSubmit={handleSubmit}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? "Registering..." : "Register"}
                </Button>
                <Typography variant="body2" align="center" marginTop={2}>
                    Already registered?{" "}
                    <Link href="/login" color="primary.main">
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Registration;

// <div>
//     <h2>Registration</h2>
//     <form onSubmit={handleSubmit}>
//         <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//         />
//         <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//         />
//         <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//         />
//         <button type="submit">Register</button>
//     </form>
//     <small>
//         Already registered? <a href="/login">Login</a>
//     </small>
// </div>
