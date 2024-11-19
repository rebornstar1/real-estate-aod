const router = require("express").Router();
const {VideoUpload} = require("../controllers/property.controller.js");
const express = require('express');
const {upload,handleUpload} = require("../middleware/video.middleware.js"); // Video middleware
const {
  getAllProperties,
  getPropertyById,
  updateProperty,
  createProperty,
  deleteProperty,
  verifyProperty,
  rejectProperty,
} = require("../controllers/property.controller");

router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyById);
router.patch("/properties/:id", updateProperty);

router.post("/properties/video",upload,handleUpload,VideoUpload);

router.post("/properties",createProperty);

router.use('/uploads', express.static('uploads'));
router.use(express.static(__dirname + '/public'));

router.delete("/properties/:id", deleteProperty);
router.patch("/make-verified", verifyProperty);
router.patch("/make-rejected", rejectProperty);

module.exports = router;
