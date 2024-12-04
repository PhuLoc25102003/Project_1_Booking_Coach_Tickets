const db = require("../config/dbConfig");



// Driver

async function addDriver(name, phone, license) {
    try {
        const [result] = await db.query('INSERT INTO drivers (driver_name, phone, license_number) VALUES (?, ?, ?)', [name, phone, license]);
        return { driver_id: result.insertId, name, phone, license };
    } catch (error) {
        console.error('Lỗi khi thêm tài xế:', error);
        throw error;
    }
}

async function deleteDriverById(driverId) {
    const query = 'DELETE FROM drivers WHERE driver_id = ?';
    try {
        const [result] = await db.query(query, [driverId]);
        return result;
    } catch (err) {
        throw err;
    }
}


async function fetchDriver() {
    try {
        const [rows] = await db.query('SELECT * FROM Drivers');
        return rows;
    } catch (error) {
        throw error;
    }
}

const updateDriver = async (id, name, phone, license) => {
    const query = `UPDATE drivers SET driver_name = ?, phone = ?, license_number = ? WHERE driver_id = ?`;

    try {
        const result = await db.query(query, [name, phone, license, id]);
        return result;  
    } catch (err) {
        throw err;  
    }
};


// Coach

async function searchCoaches(query) {
    try {
        const sql = `SELECT license_plate FROM coaches WHERE license_plate LIKE ?`;
        const values = [`%${query}%`]; 
        
        const [rows] = await db.query(sql, values);
        
        return rows;
    } catch (err) {
        console.error('Database query error:', err);  
        throw new Error('Database query failed');
    }
};

async function addCoach(type, seat, license, operator) {
    try {
        const [result] = await db.query(
            'INSERT INTO coaches (coach_type, seats , license_plate, coach_operator) VALUES (?, ?, ?, ?)',
            [type, seat, license, operator]
        );
        console.log('Insert result:', result); 
        return result.insertId;  
    } catch (error) {
        console.error('Error adding a coach:', error); 
        throw error;
    }
}

async function fetchCoach() {
    try {
        const [rows] = await db.query('SELECT * FROM coaches');
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteCoachById(coachId) {
    const query = 'DELETE FROM coaches WHERE coach_id = ?';
    try {
        const [result] = await db.query(query, [coachId]);
        return result;
    } catch (err) {
        throw err;
    }
}

const updateCoach = async (id, type, seats, license, operator) => {
    const query = `UPDATE coaches SET coach_type = ?, seats = ?, license_plate = ?, coach_operator = ? WHERE coach_id = ?`;

    try {
        console.log('Update values:', { id, type, seats, license, operator }); 
        const result = await db.query(query, [type, seats, license, operator, id]);
        console.log('Update result:', result); 
        return result;
    } catch (err) {
        console.error('Error during update:', err); 
        throw err;
    }
};



// Route

async function addRoute(license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate) {
    try {
        const [result] = await db.query(
            'INSERT INTO routes (coach_license_plate, departure_time, arrival_time, departure_point, arrival_point, date) VALUES (?, ?, ?, ?, ?, ?)',
            [license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate]
        );
        console.log('Insert result:', result); 
        return result.insertId;  
    } catch (error) {
        console.error('Error adding a route:', error); 
        throw error;
    }
}

async function fetchRoute() {
    try {
        const [rows] = await db.query('SELECT * FROM routes');
        return rows;
    } catch (error) {
        throw error;
    }
}

async function deleteRouteById(routeId) {
    const query = 'DELETE FROM routes WHERE route_id = ?';
    try {
        const [result] = await db.query(query, [routeId]);
        return result;
    } catch (err) {
        throw err;
    }
}

const updateRoute = async (routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate) => {
    const query = `UPDATE routes SET coach_license_plate = ?, departure_time = ?, arrival_time = ?, departure_point = ?, arrival_point = ?, date = ? WHERE route_id = ?`;

    try {
   
        const result = await db.query(query, [license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate, routeId]);
        return result;  
    } catch (err) {
        throw err; 
    }
};




// Client

async function fetchClient() {
    try {
        const [rows] = await db.query('SELECT * FROM clients');
        return rows;
    } catch (error) {
        throw error;
    }
}

async function addRoute(clientName, clientPhoneNumber, clientEmail ) {
    var rank = 'normal';
    try {
        const [result] = await db.query(
            'INSERT INTO clients (client_name, phone_number, email, `rank`) VALUES (?, ?, ?, ?)',
            [clientName, clientPhoneNumber, clientEmail, rank]
        );
        console.log('Insert result:', result); 
        return result.insertId;  
    } catch (error) {
        console.error('Error adding a route:', error); 
        throw error;
    }
}

async function deleteClientById(routeId) {
    const query = 'DELETE FROM clients WHERE client_id = ?';
    try {
        const [result] = await db.query(query, [routeId]);
        return result;
    } catch (err) {
        throw err;
    }
}

const updateClient = async (clientId, clientName, clientPhoneNumber, clientEmail) => {
    const query = `UPDATE clients SET client_name = ?, phone_number = ?, email = ? WHERE client_id = ?`;

    try {
        const result = await db.query(query, [clientName, clientPhoneNumber, clientEmail, clientId]);
        return result;  
    } catch (err) {
        throw err;  
    }
};




// admin 
async function createAdmin( username, password, name) {
    try {
        const [result] = await db.query('INSERT INTO admins (admin_username, admin_password,name) VALUES (?, ?, ?)', 
        [ username, password, name]);
        return {username, password, name};
    } catch (error) {
        console.error('Lỗi khi tạo admin:', error);
        throw error;
    }
}







module.exports = { addDriver, fetchDriver, deleteDriverById, updateDriver, fetchCoach, addCoach, deleteCoachById, updateCoach, addRoute, fetchRoute, deleteRouteById, searchCoaches, updateRoute, fetchClient, createAdmin, deleteClientById, updateClient };