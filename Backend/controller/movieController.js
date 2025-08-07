const Movie = require("../Model/movieModel");

// Create
exports.createMovie = async (req, res) => {
  const movie = new Movie(req.body);
  await movie.save();
  res.status(201).json(movie);
};

// Read All
exports.getAllMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};

// Read One
exports.getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: "Not found" });
  res.json(movie);
};

// Update
exports.updateMovie = async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!movie) return res.status(404).json({ message: "Not found" });
  res.json(movie);
};

// Delete
exports.deleteMovie = async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted", movie });
};
