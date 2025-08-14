const Mongoose = require("mongoose");
const movieSchema = new Mongoose.Schema({
  title: String,
  genre: String,
  releaseDate: Date,
  description: String,
  imageUrl: String,
});
module.exports = Mongoose.model("Movie", movieSchema);
