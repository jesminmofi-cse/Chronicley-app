const express = require("express");
const router = express.Router();
const {
  addWaterEntry,
  getWaterEntries,
  updateWaterEntry,
  deleteWaterEntry
} = require("../controllers/waterController");
const protect = require("../middleware/authMiddleware");
router.post("/", protect, addWaterEntry);
router.get("/", protect, getWaterEntries);
router.put("/:id", protect, updateWaterEntry);
router.delete("/:id", protect, deleteWaterEntry);
module.exports = router;
