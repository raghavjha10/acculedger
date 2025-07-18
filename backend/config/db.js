const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,     // ✅ using env variable
    user: process.env.DB_USER,     // ✅ using env variable
    password: process.env.DB_PASS, // ✅ using env variable
    database: process.env.DB_NAME  // ✅ using env variable
});

db.connect((err) => {
    if (err) throw err;            // ✅ error handling
    console.log("✅ Connected to MySQL Database");
});

module.exports = db;              // ✅ exported for use in controllers
