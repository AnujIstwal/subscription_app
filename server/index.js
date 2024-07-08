const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const subscribeRoutes = require("./routes/subscribe");
const planRoutes = require("./routes/plan");
const testRoutes = require("./routes/test");

const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
         optionsSuccessStatus: 200
    })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://subscription-app-client.vercel.app");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   next();
// });

// Routes
app.use("/", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscribeRoutes);
app.use("/api/plans", planRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
