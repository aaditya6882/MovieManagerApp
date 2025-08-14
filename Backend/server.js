const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const movieRoute = require("./routes/movieRoutes");
const uploadRoute = require("./routes/uploadRoute");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static frontend files
app.use("/static", express.static(path.join(__dirname, "../frontend")));

console.log(process.env.MONGODB_URL);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to movies database");
  })
  .catch((err) => console.error("Mongodb connection error:", err));

// Serve index.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API routes
app.use("/api/movies", movieRoute);
app.use("/uploads", uploadRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
