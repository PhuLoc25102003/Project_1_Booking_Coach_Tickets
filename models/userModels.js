const db = require("../config/dbConfig");

async function getAllAcounts() {
    try {
        const [rows] = await db.query('SELECT * FROM client_accounts');
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        throw error;
    }
}


async function createClient( username, password, name, email, phoneNumber) {
    const rank = 'normal';  // Default rank
    try {
        // Use the `client_id` from the Account to insert into Client
        const [result] = await db.query('INSERT INTO clients (client_username, client_password, client_name, phone_number, email, `rank`) VALUES (?, ?, ?, ?, ?, ?)', 
        [ username, password, name, phoneNumber, email, rank]);
        return {username, password, name, email, phoneNumber, rank };
    } catch (error) {
        console.error('Lỗi khi tạo client:', error);
        throw error;
    }
}

const findUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM clients WHERE client_username = ?', [username]);
    return rows[0]; 
};

const findAdminByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM admins WHERE admin_username = ?', [username]);
    return rows[0]; 
};



module.exports = {
    getAllAcounts,
    findUserByUsername,
    createClient,
    findAdminByUsername,
};