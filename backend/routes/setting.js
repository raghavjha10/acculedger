const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/update", async (req, res) => {
  const { email, password, darkMode, notifications, twoFA, backup } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    // ✅ Log received data for debugging (optional)
    console.log("Received settings update:", {
      email,
      darkMode,
      notifications,
      twoFA,
      backup,
      passwordProvided: !!password
    });

    // ✅ Simulate password processing if needed
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Simulated password hash:", hashedPassword);
    }

    // ✅ Respond with success without DB update
    res.json({
      success: true,
      message: "Settings updated successfully (DB skipped)"
    });

  } catch (err) {
    console.error("Error:", err);
    res.json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
