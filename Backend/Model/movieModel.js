const Mongoose = require("mongoose");
const movieSchema = new Mongoose.Schema({
  title: String,
  director: String,
  year: Number,
});
module.exports = Mongoose.model("Movie", movieSchema);
