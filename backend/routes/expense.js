const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST: Add Expense
router.post('/add', (req, res) => {
  const { username, category, amount, date, notes } = req.body;

  if (!username) {
    console.error('Missing username in request body');
    return res.status(400).json({ error: 'Username is required' });
  }

  const sql = `INSERT INTO expenses (user_email, category, amount, date, notes)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [username, category, amount, date, notes], (err, result) => {
    if (err) {
      console.error('Error inserting expense:', err);
      return res.status(500).json({ error: 'Failed to add expense' });
    }
    res.json({ success: true, message: 'Expense added successfully' });
  });
});

// GET: Fetch Expenses by User Email
router.get('/:email', (req, res) => {
  const userEmail = req.params.email;

  const sql = 'SELECT * FROM expenses WHERE user_email = ? ORDER BY date DESC';
  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error('Error fetching expenses:', err);
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }
    res.json(results);
  });
});

module.exports = router;
