const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authenticateToken = require("./middleware/authMiddleware");
const pool = require("./db");
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/requests", requestRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Community Surplus API is working!"
    });
});
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You can access this protected route!",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

pool.query("SELECT NOW()", (error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
    } else {
        console.log("Database connected successfully!");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});