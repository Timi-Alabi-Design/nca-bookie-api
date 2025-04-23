const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("NCA Bookie API Running..."));

// DB + Server Start
mongoose.connect(process.env.MONGO_URI)
        .then(() => {
                console.log("MongoDB connected");
                app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        })
        .catch(err => console.error(err));
