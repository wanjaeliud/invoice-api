const mysql = require("mysql");
// const dbConfig = require("../db/config");

// Create a connection to the database
const connection = mysql.createConnection({
    host: "localhost",
    user: "eliud",
    password: "@MySql#22/Root",
    port: "3308",
    database: "testdb",
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});
module.exports = connection;