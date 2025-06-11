const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const users = await User.find().select('-password');


router.get("/test-db", async (req, res) => {
  try {
    const users = await mongoose.connection.db
      .collection("users")
      .find()
      .toArray();
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
