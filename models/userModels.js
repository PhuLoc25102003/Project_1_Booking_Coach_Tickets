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

async function updateUserProfile(clientId, { fullName, email, phone }) {
    try {
        const query = `
            UPDATE clients 
            SET client_name = ?, email = ?, phone_number = ?
            WHERE client_id = ?
        `;
        const [result] = await db.query(query, [fullName, email, phone, clientId]);
        console.log('Update result:', result);
        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
        return result;
    } catch (err) {
        console.error('Error updating user profile:', err);
        throw err;
    }
}


async function createClient(username, password, name, email, phoneNumber) {
    const rank = 'normal';  // Default rank
    try {
        const [result] = await db.query('INSERT INTO clients (client_username, client_password, client_name, phone_number, email, `rank`) VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, name, phoneNumber, email, rank]);
        return { username, password, name, email, phoneNumber, rank };
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

const getUserBookings = async (clientId, page = 1, limit = 5) =>{
    try {
        const offset = (page - 1) * limit;
        const query = `
            SELECT 
                b.booking_id, 
                r.departure_point, 
                r.arrival_point, 
                b.order_date, 
                b.seat_number, 
                b.price, 
                b.order_status
            FROM booking b
            JOIN routes r ON b.route_id = r.route_id
            WHERE b.client_id = ?
            LIMIT ? OFFSET ?
        `;
        const [rows] = await db.query(query, [clientId, limit, offset]);
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM booking WHERE client_id = ?', [clientId]);
        const totalBookings = countResult[0].total;
        const totalPages = Math.ceil(totalBookings / limit);
        console.log('Bookings retrieved:', rows, 'Total pages:', totalPages);
        return { bookings: rows, totalPages };
    } catch (err) {
        console.error('Error fetching bookings:', err);
        throw err;
    }
};

const changePassword = async (clientId, currentPassword, newPassword) => {
    try {
        const [rows] = await db.query('SELECT client_password FROM clients WHERE client_id = ?', [parseInt(clientId)]);
        console.log('Raw query result:', rows); 
        
        if (!rows || rows.length === 0) {
            throw new Error('User not found');
        }

        const user = rows[0]; 
        console.log('User object:', user);
        console.log('DB password:', user.client_password, 'typeof:', typeof user.client_password);
        console.log('Client password:', currentPassword, 'typeof:', typeof currentPassword);

        if (user.client_password.trim() !== currentPassword.trim()) {
            console.log('Password mismatch - DB:', user.client_password, 'Client:', currentPassword);
            throw new Error('Mật khẩu hiện tại không đúng');
        }

        const query = `
            UPDATE clients 
            SET client_password = ?
            WHERE client_id = ?
        `;
        const [result] = await db.query(query, [newPassword, clientId]);
        if (result.affectedRows === 0) throw new Error('User not found');
        console.log('Password updated for client_id:', clientId);
        return result;
    } catch (err) {
        console.error('Error changing password:', err);
        throw err;
    }
};


module.exports = {
    getAllAcounts,
    findUserByUsername,
    createClient,
    findAdminByUsername,
    updateUserProfile,
    getUserBookings,
    changePassword
    
};