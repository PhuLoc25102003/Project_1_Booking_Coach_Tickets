const db = require("../config/dbConfig");

async function getAllAcounts() {
    try {
        const [rows] = await db.query('SELECT * FROM Account');
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', err);
        throw error;
    }
}

async function fetchRoute() {
    try {
        const [rows] = await db.query('SELECT * FROM route');
        return rows;
      } catch (error) {
        throw error;
      }
}

async function createAccount(username, password) {
    try {
        const [result] = await db.query('INSERT INTO Account (username, password) VALUES (?, ?)', [username, password]);
        return { client_id: result.insertId, username, password };  // `insertId` is the newly created client_id
    } catch (error) {
        console.error('Lỗi khi tạo tài khoản:', error);
        throw error;
    }
}

async function createClient(clientId, name, email, phoneNumber) {
    const rank = 'normal';  // Default rank
    try {
        // Use the `client_id` from the Account to insert into Client
        const [result] = await db.query('INSERT INTO client (client_id, client_name, phone_number, email, `rank`) VALUES (?, ?, ?, ?, ?)', 
        [clientId, name, phoneNumber, email, rank]);
        return { clientId, name, email, phoneNumber, rank };
    } catch (error) {
        console.error('Lỗi khi tạo client:', error);
        throw error;
    }
}
async function createRoute(coach_name, coach_operator, departureTime, arrivalTime, departurePoint, arrivalPoint) {
    
    try {
        // Use the `client_id` from the Account to insert into Client
        const [result] = await db.query('INSERT INTO route (coach_name, coach_operator, departure_time, arrival_time, departure_point, arrival_point) VALUES (?, ?, ?, ?, ?, ?)', 
        [coach_name, coach_operator, departureTime, arrivalTime, departurePoint, arrivalPoint]);
        return { route_id: result.insertId, coach_name, coach_operator, departureTime, arrivalTime, departurePoint, arrivalPoint};
    } catch (error) {
        console.error('Lỗi khi tạo route', error);
        throw error;
    }
}
const findUserByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM Account WHERE username = ?', [username]);
    return rows[0]; 
};

const findAdminByUsername = async (username) => {
    const [rows] = await db.query('SELECT * FROM Admin WHERE username = ?', [username]);
    return rows[0]; 
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
    createAccount,
    createClient,
    createRoute,
    fetchRoute,
    findAdminByUsername,
};