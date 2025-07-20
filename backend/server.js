// ============================
// Imports & Setup
// ============================
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');     // ✅ Signup & Login Routes
const incomeRoutes = require('./routes/income');       // ✅ Income Routes
const expenseRoutes = require('./routes/expense');     // ✅ Expense Routes
const invoiceRoutes = require('./routes/invoice');     // ✅ Invoice Routes
const settingRoutes = require('./routes/setting');           // ✅ User Routes

const app = express();  
const PORT = process.env.PORT || 5000;

// ============================
// MySQL Database Connection
// ============================
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "acculedger"
});

// ✅ Make DB accessible via app.set
app.set('db', db);

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'acculedger_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true only in production with HTTPS
}));

// ============================
// Nodemailer Setup
// ============================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ============================
// Routes
// ============================

// ✅ Auth Route (Signup & Login)
app.use('/api', authRoutes);

// ✅ Income Route
app.use('/api/income', incomeRoutes);

// ✅ Expense Route
app.use('/api/expense', expenseRoutes);

// ✅ Invoice Route
app.use('/api/invoice', invoiceRoutes);

// ✅ Settings Route
app.use('/api/user', settingRoutes);

// ---------- Forgot Password ----------
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).send("❗ Email is required");

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error("❌ DB error:", err);
            return res.status(500).send("Internal server error");
        }

        if (results.length === 0) {
            return res.status(404).send("❌ Email not found");
        }

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
                <p>If you didn’t request this, please ignore this email.</p>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Mail error:", error);
                return res.status(500).send("Failed to send reset email.");
            }
            console.log("📧 Email sent:", info.response);
            res.send("✅ Password reset link sent to your email.");
        });
    });
});

// ---------- Reset Password ----------
app.post('/api/reset-password/:id', async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || !newPassword) {
        return res.status(400).send("❗ User ID and new password are required.");
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, id], (err, result) => {
            if (err) {
                console.error("❌ DB update error:", err);
                return res.status(500).send("Error updating password.");
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("❌ User not found.");
            }

            res.send("✅ Password has been reset successfully.");
        });
    } catch (err) {
        console.error("❌ Hashing error:", err);
        res.status(500).send("Internal server error.");
    }
});

// ---------- Test Route ----------
app.get('/', (req, res) => {
    res.send("🎉 Welcome to AccuLedger Backend API");
});

// ============================
// Start Server
// ============================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
