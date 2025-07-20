const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.resetPassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).send("User ID and new password are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(sql, [hashedPassword, userId], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Failed to update password.");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("User not found.");
      }

      return res.send("✅ Password updated successfully.");
    });
  } catch (error) {
    console.error("Hashing error:", error);
    return res.status(500).send("Internal server error.");
  }
};
