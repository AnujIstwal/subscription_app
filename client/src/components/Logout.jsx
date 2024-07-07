import { toast } from "react-hot-toast";
import { IconButton } from "@mui/material";
import { LogoutRounded } from "@mui/icons-material";

const Logout = () => {
    const logoutHandle = () => {
        toast.success("Logged out successfully");
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    };

    return (
        <IconButton
            type="button"
            variant="outlined"
            onClick={logoutHandle}
            sx={{
                position: "fixed",
                right: 0,
                top: 0,
                m: 2,
                p: 1,
                boxShadow: 0,
                bgcolor: "#fff",
                ":hover": {
                    bgcolor: "#f2f2f2",
                },
            }}
            size="large"
        >
            <LogoutRounded sx={{ fontSize: "2rem" }} />
        </IconButton>
    );
};

export default Logout;
