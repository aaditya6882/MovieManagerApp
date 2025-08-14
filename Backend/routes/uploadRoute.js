const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const { uploadImage } = require("../controller/uploadController");

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
