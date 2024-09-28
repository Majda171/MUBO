const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "books"
});

connection.connect(err => {
    if (err) throw err;
    console.log("Úspěšné připojení k databázi");
});

module.exports = connection;