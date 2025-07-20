// backend/routes/invoice.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/add", (req, res) => {
  const { user_email, client_name, invoice_number, amount, due_date, notes } = req.body;

  if (!user_email || !client_name || !invoice_number) {
    return res.status(400).send("Missing required fields!");
  }

  const sql = `INSERT INTO invoices (user_email, client_name, invoice_number, amount, due_date, notes)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [user_email, client_name, invoice_number, amount, due_date, notes], (err, result) => {
    if (err) {
      console.error("Error inserting invoice:", err);
      return res.status(500).send("Error saving invoice");
    }
    res.send("Invoice saved successfully");
  });
});

module.exports = router;
