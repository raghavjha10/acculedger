const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adjust path if needed

// Route: POST /api/income
router.post('/', (req, res) => {
  const { email, source, amount, category, date, notes } = req.body;

  const query = `INSERT INTO income (email, source, amount, category, date, notes)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [email, source, amount, category, date, notes], (err, result) => {
    if (err) {
      console.error("Income insert error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ success: true, message: "Income saved successfully" });
  });
});

module.exports = router;
