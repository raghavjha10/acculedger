app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).send("Error checking email");

        if (results.length > 0) {
            const userId = results[0].id;
            const resetLink = `http://localhost:5500/frontend/Reset_Password.html?id=${userId}`;

            // Send email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Reset Your AccuLedger Password",
                html: `
                    <h3>Hi ${results[0].name},</h3>
                    <p>You requested to reset your password.</p>
                    <p>Click the link below to reset it:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>If you didn’t request this, you can ignore this email.</p>
                    <p><strong>- AccuLedger Team</strong></p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Email error:", error);
                    return res.status(500).send("Failed to send reset email.");
                }
                console.log("Email sent:", info.response);
                res.send("Reset link has been sent to your email.");
            });

        } else {
            res.status(404).send("Email not found.");
        }
    });
});
