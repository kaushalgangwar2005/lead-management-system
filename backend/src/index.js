require("dotenv").config();

console.log("Starting Lead Management backend...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const leadsRoutes = require("./routes/leads");
const trackRoutes = require("./routes/track");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);

app.use(bodyParser.json({ limit: "1mb" }));

app.use("/api/leads", leadsRoutes);
app.use("/api/track", trackRoutes);

app.get("/", (req, res) => {
  res.send("Lead Management Backend");
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}

start();