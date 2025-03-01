const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'loc0918119316',
    database: 'project_b',
    waitForConnections: true,
    connectionLimit: 10,    
    queueLimit: 0
});

module.exports = pool.promise();