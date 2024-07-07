import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Link,
    Typography,
    Box,
    useMediaQuery, //for setting break points
} from "@mui/material";

const Login = ({ setAuth }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingId = toast.loading("Logging In");
        try {
            const response = await axios.post("/api/auth/login", formData);

            console.log("Login successfull");
            toast.success("Successfully logined", {
                id: loadingId,
                duration: 4000,
            });

            // Save the token based on rememberMe
            if (formData.rememberMe) {
                localStorage.setItem("token", response.data.token);
            } else {
                sessionStorage.setItem("token", response.data.token);
            }

            setLoading(false);
            setAuth(true);
            navigate("/plans");
        } catch (error) {
            console.error("Error logging in:", error.response.data);
            toast.error("Login Failed", { id: loadingId });
        }
        setLoading(false);
    };

    // Define the media query for screens less than 600px wide
    const isSmallScreen = useMediaQuery("(max-width:600px)");

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            maxWidth="380px "
            width={isSmallScreen ? "90vw" : "50vw"}
            bgcolor="#fff"
            borderRadius="1.2rem"
            p="2rem"
            data-aos="fade-left"
            data-aos-easing="linear"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                maxWidth={400}
                width="100%"
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Login to your Account
                </Typography>
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    size="small"
                    sx={{ fontSize: 10 }}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    size="small"
                    sx={{ fontSize: 10 }}
                    fullWidth
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.rememberMe}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    rememberMe: e.target.checked,
                                })
                            }
                            name="rememberMe"
                            color="primary"
                        />
                    }
                    label="Remember Me"
                    sx={{ "& .MuiTypography-root": { fontSize: "0.875rem" } }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ bgcolor: "primary.main", mt: 2 }}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? "Logging in ..." : "Login"}
                </Button>
                <Typography variant="body2" align="center" marginTop={2}>
                    Don&apos;t have an account?{" "}
                    <Link href="/register" color="primary.main">
                        Register
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;

// <div>
//   <div>
//     <h2>Login</h2>
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={handleChange}
//       />
//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={handleChange}
//       />
//       <div>
//         <input
//           type="checkbox"
//           checked={formData.rememberMe}
//           onChange={e =>
//             setFormData({
//               ...formData,
//               rememberMe: e.target.checked,
//             })
//           }
//         />
//         <label>Remember Me</label>
//       </div>
//       <button type="submit">Login</button>
//     </form>
//     <small>
//       Don&apos;t have an account? <a href="/register">Register</a>
//     </small>
//   </div>
// </div>
