const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const mongoose = require("mongoose");
const movieRoute = require("./routes/movieRoutes");
dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "../frontend")));

console.log(process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to movies database");
  })
  .catch((err) => console.error("Mongodb connection error:", err));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/static", express.static(path.join(__dirname, "../frontend")));
app.use("/api/movies", movieRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
