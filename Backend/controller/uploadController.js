exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  return res.status(200).json({
    message: "Image uploaded successfully",
    file: {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    },
  });
};
