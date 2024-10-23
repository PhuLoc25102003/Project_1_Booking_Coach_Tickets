const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'loc0918119316',
    database: 'Project_1',
    waitForConnections: true,
    connectionLimit: 10,    // Adjust based on your app's needs
    queueLimit: 0
});

module.exports = pool.promise();