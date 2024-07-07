import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#1e4c90",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "capitalize",
                    fontWeight: 400,
                },
            },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: "0.875rem", // Change the font size here
                },
            },
        },
    },
});

export default theme;
