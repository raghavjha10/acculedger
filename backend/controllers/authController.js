// ============================
// Auth Controller
// ============================
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Mail Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).send("❌ All fields are required.");

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword], (err) => {
    if (err) {
      console.error("❌ Registration Error:", err);
      return res.status(500).send("❌ Email already exists or error occurred.");
    }
    res.send("✅ Registered successfully. Please log in.");
  });
};

// Login User
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send("❌ Invalid email or password");

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).send("❌ Invalid email or password");

    res.send("✅ Login successful");
  });
};

// Forgot Password
exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send("❌ Error checking email");
    if (results.length === 0) return res.status(404).send("❌ Email not found");

    const userId = results[0].id;
    const resetLink = `http://localhost:5500/frontend/Reset_Password.html?id=${userId}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔑 Reset Your AccuLedger Password",
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Mail error:", error);
        return res.status(500).send("❌ Failed to send email");
      }
      console.log("📧 Email sent:", info.response);
      res.send("✅ Reset link sent to your email");
    });
  });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || !id) return res.status(400).send("❗ Required fields missing");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id], (err, result) => {
    if (err) return res.status(500).send("❌ Error updating password");
    if (result.affectedRows === 0) return res.status(404).send("❌ User not found");
    res.send("✅ Password reset successful");
  });
};

// Get User by Email
exports.getUserByEmail = (req, res) => {
  const email = req.params.email;
  const query = "SELECT name, email FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result[0]);
  });
};
