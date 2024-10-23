const db = require("../config/dbConfig");

async function getAllAcounts() {
    try {
        const [rows] = await db.query('SELECT * FROM Account');
        return rows;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        throw error;
    }
}

async function createAccount(username, password) {
    try{
        const [result] = await db.query('INSERT INTO Account (username,password) VALUE (?,?)', [username, password]);
        return { client_id: result.insertId, username, password };
    }catch(error){
        console.error('Lỗi khi tạo tài khoản:', error);
        throw error;
    }
}

const findUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM Account WHERE username = ?', [username]);
    return rows[0];  // Trả về tài khoản đầu tiên tìm thấy (nếu có)
};


const checkConnection = async () => {
    try {
        // Thực hiện một truy vấn đơn giản để kiểm tra kết nối
        await db.query('SELECT 1');
        console.log('Kết nối với cơ sở dữ liệu thành công!');
    } catch (err) {
        console.error('Lỗi kết nối đến cơ sở dữ liệu:', err);
    }
};

module.exports = {
    checkConnection,
    getAllAcounts,
    findUserByUsername,
    createAccount
};