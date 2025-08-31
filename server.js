const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

const { connectDB } = require("./config/db");
const apiRoutes = require("./routes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));

app.use(
    express.json({
        extended: true,
    })
);

app.use(
    express.urlencoded({
        extended: true,
    })
);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Mount API routers (will add later)
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
}

connectDB(MONGODB_URI).then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
