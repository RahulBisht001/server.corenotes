const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const {connectDB} = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Health check
app.get("/health", (req, res) => {
    res.json({status: "ok"});
});

// Mount API routers (will add later)
// app.use('/api', require('./routes')); // placeholder

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
}

connectDB(MONGODB_URI).then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
