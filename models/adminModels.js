const db = require("../config/dbConfig");

// Driver_function
const driver = {
    getDrivers: async (limit, offset, searchValue, orderColumn, orderDir) => {
        try {
            const queryParams = [];
            let query = `SELECT * FROM drivers`;
            let countQuery = `SELECT COUNT(*) as total FROM drivers`;

            if (searchValue) {
                query += ` WHERE driver_name LIKE ? OR phone LIKE ? OR license_number LIKE ?`;
                countQuery += ` WHERE driver_name LIKE ? OR phone LIKE ? OR license_number LIKE ?`;

                queryParams.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            const allowedColumns = ['driver_id', 'driver_name', 'phone', 'license_number'];
            if (!allowedColumns.includes(orderColumn)) {
                orderColumn = 'driver_id';
            }

            query += ` ORDER BY ${orderColumn} ${orderDir}`;
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            const [countResult] = await db.execute(countQuery, queryParams);
            const [data] = await db.execute(query, queryParams);

            return {
                total: countResult[0].total,
                filtered: countResult[0].total,
                data
            };

        } catch (error) {
            throw error;
        }
    }
    ,
    addDriver: async (name, phone, license) => {
        try {
            const [result] = await db.query('INSERT INTO drivers (driver_name, phone, license_number) VALUES (?, ?, ?)', [name, phone, license]);
            return { driver_id: result.insertId, name, phone, license };
        } catch (error) {
            console.error('Lỗi khi thêm tài xế:', error);
            throw error;
        }
    },
    deleteDriverById: async (driverId) => {
        const query = 'DELETE FROM drivers WHERE driver_id = ?';
        try {
            const [result] = await db.query(query, [driverId]);
            return result;
        } catch (err) {
            throw err;
        }
    },
    updateDriver: async (id, name, phone, license) => {
        const query = `UPDATE drivers SET driver_name = ?, phone = ?, license_number = ? WHERE driver_id = ?`;

        try {
            const result = await db.query(query, [name, phone, license, id]);
            return result;
        } catch (err) {
            throw err;
        }
    },
    searchDrivers: async (query) => {
        try {
            const sql = `SELECT driver_id, driver_name FROM drivers WHERE driver_name LIKE ?`;
            const values = [`%${query}%`];

            const [rows] = await db.query(sql, values);

            return rows;
        } catch (err) {
            console.error('Database query error:', err);
            throw new Error('Database query failed');
        }
    },
};


// Coach_function
const coach = {
    getCoaches: async (limit, offset, searchValue, orderColumn, orderDir) => {
        try {
            const queryParams = [];
            let query = `
                SELECT coaches.coach_id, coaches.coach_type, coaches.seats, coaches.license_plate, 
                       drivers.driver_name, coaches.coach_operator
                FROM coaches
                JOIN drivers ON coaches.driver_id = drivers.driver_id
            `;

            let countQuery = `
                SELECT COUNT(*) as total
                FROM coaches
                JOIN drivers ON coaches.driver_id = drivers.driver_id
            `;

            if (searchValue && searchValue.trim() !== '') {
                query += ` WHERE coaches.coach_type LIKE ? 
                        OR coaches.license_plate LIKE ? 
                        OR coaches.coach_operator LIKE ? 
                        OR drivers.driver_name LIKE ?`;
                countQuery += ` WHERE coaches.coach_type LIKE ? 
                            OR coaches.license_plate LIKE ? 
                            OR coaches.coach_operator LIKE ? 
                            OR drivers.driver_name LIKE ?`;

                queryParams.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            const allowedColumns = ['coach_id', 'coach_type', 'seats', 'license_plate', 'driver_name', 'coach_operator'];
            if (!allowedColumns.includes(orderColumn)) {
                orderColumn = 'coach_id';
            }

            query += ` ORDER BY ${orderColumn} ${orderDir}`;
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            const [countResult] = await db.execute(countQuery, queryParams);
            const [data] = await db.execute(query, queryParams);

            return {
                total: countResult[0].total,
                filtered: countResult[0].total,
                data
            };

        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    },

    searchCoaches: async (query) => {
        try {
            const sql = `SELECT coach_id, license_plate FROM coaches WHERE license_plate LIKE ?`;
            const values = [`%${query}%`];

            const [rows] = await db.query(sql, values);

            return rows;
        } catch (err) {
            console.error('Database query error:', err);
            throw new Error('Database query failed');
        }
    },
    addCoach: async (type, seat, license, operator, driverId) => {
        try {
            const [result] = await db.query(
                'INSERT INTO coaches (coach_type, seats , license_plate, coach_operator, driver_id) VALUES (?, ?, ?, ?, ?)',
                [type, seat, license, operator, driverId]
            );
            const coachId = result.insertId;

            return coachId;

        } catch (error) {
            console.error('Error adding a coach:', error);
            throw error;
        }
    },
    deleteCoachById: async (coachId) => {
        const query = 'DELETE FROM coaches WHERE coach_id = ?';
        try {
            const [result] = await db.query(query, [coachId]);
            return result;
        } catch (err) {
            throw err;
        }
    },
    updateCoach: async (id, type, seats, license, operator) => {
        const query = `UPDATE coaches SET coach_type = ?, seats = ?, license_plate = ?, coach_operator = ? WHERE coach_id = ?`;

        try {
            const result = await db.query(query, [type, seats, license, operator, id]);
            return result;
        } catch (err) {
            console.error('Error during update:', err);
            throw err;
        }
    }
};




// Route_function
const route = {
    getRoutes: async (limit, offset, searchValue, orderColumn, orderDir) => {
        try {
            const queryParams = [];
            let query = `SELECT * FROM routes`;
            let countQuery = `SELECT COUNT(*) as total FROM routes`;

            if (searchValue) {
                query += ` WHERE coach_license_plate LIKE '%${searchValue}%' OR departure_point LIKE '%${searchValue}%' OR arrival_point LIKE '%${searchValue}%' OR price LIKE '%${searchValue}%'`;
                countQuery += ` WHERE coach_license_plate LIKE '%${searchValue}%' OR departure_point LIKE '%${searchValue}%' OR arrival_point LIKE '%${searchValue}%' OR price LIKE '%${searchValue}%'`;
                queryParams.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            const allowedColumns = ['route_id', 'coach_license_plate', 'departure_time', 'arrival_time', 'departure_point', 'arrival_point', 'price'];
            if (!allowedColumns.includes(orderColumn)) {
                orderColumn = 'route_id';
            }

            query += ` ORDER BY ${orderColumn} ${orderDir}`;
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            const [countResult] = await db.execute(countQuery, queryParams);
            const [data] = await db.execute(query, queryParams);

            return {
                total: countResult[0].total,
                filtered: countResult[0].total,
                data
            };
        } catch (error) {
            throw error;
        }
    },
    addRoute: async (departureTime, arrivalTime, departurePoint, arrivalPoint, license, price) => {
        try {
            const [result] = await db.query(
                'INSERT INTO routes (departure_time, arrival_time, departure_point, arrival_point, coach_license_plate, price) VALUES (?, ?, ?, ?, ?, ?)',
                [departureTime, arrivalTime, departurePoint, arrivalPoint, license, price]
            );
            console.log('Insert result:', result);
            return result.insertId;
        } catch (error) {
            console.error('Error adding a route:', error);
            throw error;
        }
    },
    deleteRouteById: async (routeId) => {
        const query = 'DELETE FROM routes WHERE route_id = ?';
        try {
            const [result] = await db.query(query, [routeId]);
            return result;
        } catch (err) {
            throw err;
        }
    },
    updateRoute: async (routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, price) => {
        const query = `
            UPDATE routes 
            SET coach_license_plate = ?, departure_time = ?, arrival_time = ?, departure_point = ?, arrival_point = ?, price = ?
            WHERE route_id = ?
        `;
        try {
            const [result] = await db.query(query, [license, departureTime, arrivalTime, departurePoint, arrivalPoint, price, routeId]);
            console.log('Update result:', result);
            return result;
        } catch (err) {
            console.error('Error in updateRoute:', err);
            throw err;
        }
    }

};

// Client_function
const client = {
    getClients: async (limit, offset, searchValue, orderColumn, orderDir) => {
        try {
            const queryParams = [];
            let query = `SELECT * FROM clients`;
            let countQuery = `SELECT COUNT(*) as total FROM clients`;

            if (searchValue) {
                query += ` WHERE client_name LIKE '%${searchValue}%' OR phone_number LIKE '%${searchValue}%' OR email LIKE '%${searchValue}%' OR expense LIKE '%${searchValue}%'`;
                countQuery += ` WHERE client_name LIKE '%${searchValue}%' OR phone_number LIKE '%${searchValue}%' OR email LIKE '%${searchValue}%'  OR expense LIKE '%${searchValue}%'`;
                queryParams.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            const allowedColumns = ['client_id', 'client_name', 'phone_number', 'email', 'rank', 'expense'];
            if (!allowedColumns.includes(orderColumn)) {
                orderColumn = 'client_id';
            }

            query += ` ORDER BY ${orderColumn} ${orderDir}`;
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            const [countResult] = await db.execute(countQuery, queryParams);
            const [data] = await db.execute(query, queryParams);

            return {
                total: countResult[0].total,
                filtered: countResult[0].total,
                data
            };
        } catch (error) {
            throw error;
        }
    },
    addClient: async (clientName, clientPhoneNumber, clientEmail) => {
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
    },
    deleteClientById: async (routeId) => {
        const query = 'DELETE FROM clients WHERE client_id = ?';
        try {
            const [result] = await db.query(query, [routeId]);
            return result;
        } catch (err) {
            throw err;
        }
    },
    updateClient: async (clientId, clientName, clientPhoneNumber, clientEmail) => {
        const query = `UPDATE clients SET client_name = ?, phone_number = ?, email = ? WHERE client_id = ?`;

        try {
            const result = await db.query(query, [clientName, clientPhoneNumber, clientEmail, clientId]);
            return result;
        } catch (err) {
            throw err;
        }
    }

};


// admin 
async function createAdmin(username, password, name) {
    try {
        const [result] = await db.query('INSERT INTO admins (admin_username, admin_password, admin_name) VALUES (?, ?, ?)',
            [username, password, name]);
        return { username, password, name };
    } catch (error) {
        console.error('Lỗi khi tạo admin:', error);
        throw error;
    }
}


// Booking_function
const booking = {
    getBookings: async (limit, offset, searchValue, orderColumn, orderDir) => {
        try {
            const queryParams = [];
            let query = `
            SELECT b.booking_id, c.client_name, b.seat_number, b.booking_date, b.order_status
            FROM booking b
            JOIN clients c ON b.client_id = c.client_id
            where b.order_status = 'in process'
        `;
            let countQuery = `
        SELECT COUNT(*) as total
        FROM booking b
        JOIN clients c ON b.client_id = c.client_id
        where b.order_status = 'in process'
    `;
            if (searchValue) {
                query += `
                WHERE b.booking_id LIKE ? 
                OR c.client_name LIKE ? 
                OR b.seat_number LIKE ? 
                OR b.order_status LIKE ?
            `;
                countQuery += `
                WHERE b.booking_id LIKE ? 
                OR c.client_name LIKE ? 
                OR b.seat_number LIKE ? 
                OR b.order_status LIKE ?
            `;
                queryParams.push(`%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`, `%${searchValue}%`);
            }

            const allowedColumns = ['b.booking_id', 'c.client_name', 'b.seat_number', 'b.booking_date', 'b.order_status'];
            if (!allowedColumns.includes(orderColumn)) {
                orderColumn = 'booking_id';
            }

            query += ` ORDER BY ${orderColumn} ${orderDir}`;
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            const [countResult] = await db.execute(countQuery, queryParams);
            const [data] = await db.execute(query, queryParams);

            return {
                total: countResult[0].total,
                filtered: countResult[0].total,
                data
            };
        } catch (error) {
            throw error;
        }
    },
    getBookingDetails: async (bookingId) => {
        try {
            const query = `
                SELECT 
                    b.booking_id,
                    c.client_id,
                    c.client_name,
                    c.email,
                    r.departure_point,
                    r.arrival_point,
                    r.departure_time,
                    b.seat_number,
                    b.price,
                    b.order_status
                FROM booking b
                JOIN clients c ON b.client_id = c.client_id
                JOIN routes r ON b.route_id = r.route_id
                WHERE b.booking_id = ?
            `;
            console.log('Executing query for booking_id:', bookingId);
            const [results] = await db.query(query, [bookingId]);

            console.log('Query results:', results);

            if (results.length === 0) {
                throw new Error(`Booking with ID ${bookingId} not found or missing related data in clients/routes`);
            }

            return results[0];
        } catch (err) {
            console.error('Error fetching booking details:', err.message, err.stack);
            throw err;
        }
    },
    searchClients: async (query) => {
        try {
            const sql = `SELECT client_id, client_name FROM clients WHERE client_name LIKE ?`;
            const values = [`%${query}%`];

            const [rows] = await db.query(sql, values);

            return rows;
        } catch (err) {
            console.error('Database query error:', err);
            throw new Error('Database query failed');
        }
    },
    searchRoutes: async (query) => {
        try {
            const sql = `SELECT r.route_id, r.departure_point, r.arrival_point, r.price, c.coach_operator, c.coach_id, c.seats
                        FROM routes r join coaches c on r.coach_license_plate = c.license_plate
                        WHERE r.departure_point LIKE ? or r.arrival_point like ?`;
            values = [`%${query}%`, `%${query}%`];

            const [rows] = await db.query(sql, values);

            return rows;
        } catch (err) {
            console.error('Database query error:', err);
            throw new Error('Database query failed');
        }
    },
    addBooking: async (bookingId, routeId, clientId, orderDate, price, seatNumber, orderStatus) => {
        try {
            const query = `
                INSERT INTO booking (booking_id, route_id, client_id, order_date, price, seat_number, order_status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [bookingId, routeId, clientId, orderDate, price, seatNumber, orderStatus];

            const [result] = await db.query(query, values);
            console.log('Insert result:', result);
            return result;
        } catch (err) {
            console.error('Error adding booking:', err);
            throw err;
        }
    },
    updateBookingStatus: async (bookingId, orderStatus) => {
        try {
            const query = `
                UPDATE booking
                SET order_status = ?
                WHERE booking_id = ?
            `;
            const values = [orderStatus, bookingId];

            const [result] = await db.query(query, values);
            console.log('Update result:', result);

            if (result.affectedRows === 0) {
                throw new Error('Booking not found');
            }
            return result;
        } catch (err) {
            console.error('Error updating booking status:', err);
            throw err;
        }
    },
    getBookedList: async (routeId, bookingDate) => {
        try {
            let query = `
                SELECT seat_number
                FROM booking
                WHERE route_id = ? and order_status <> 'cancelled'
            `;
            const values = [routeId];

            if (bookingDate) {
                query += ` AND order_date = ?`;
                values.push(bookingDate);
            }

            const [results] = await db.query(query, values);
            console.log('Query results:', results);

            const bookedSeats = [];
            results.forEach(row => {
                const seats = row.seat_number.split(',').map(num => parseInt(num.trim()));
                bookedSeats.push(...seats);
            });

            return [...new Set(bookedSeats)];
        } catch (err) {
            console.error('Error fetching booked seats:', err);
            throw err;
        }
    },
    getExpiredBookings: async (timeThreshold) => {
        try {
            const query = `
                SELECT booking_id, booking_date
                FROM booking
                WHERE order_status = 'in process'
                AND booking_date <= ?
            `;
            const [results] = await db.query(query, [timeThreshold]);
            console.log('Expired bookings with booking_date:', results);
            return results;
        } catch (err) {
            console.error('Error fetching expired bookings:', err.message, err.stack);
            throw err;
        }
    },
    updateClientExpense: async (clientId, price) => {
        try {
            const query = 'update clients set expense = coalesce(expense, 0) + ? Where client_id = ?';
            const value = [price, clientId];
            const [result] = await db.query(query, value);
            console.log('Update expense result:', result);

            if (result.affectedRows === 0) {
                throw new Error(`Client with ID ${clientId} not found`);
            }
            return result;
        }
        catch (err) {
            console.error('Error updating expense:', err);
            throw err;
        }
    }
}



const dashboard = {
    getTotalCoaches: async () => {
        const query = 'SELECT COUNT(*) AS totalCoaches FROM coaches';
        try {
            const [result] = await db.query(query);
            return result[0].totalCoaches;
        } catch (err) {
            console.error('Error fetching total coaches:', err);
            throw err;
        }
    },
    getTotalClients: async () => {
        const query = 'SELECT COUNT(*) AS totalClients FROM clients';
        try {
            const [result] = await db.query(query);
            return result[0].totalClients;
        } catch (err) {
            console.error('Error fetching total clients:', err);
            throw err;
        }
    },
    getTotalAdmins: async () => {
        const query = 'SELECT COUNT(*) AS totalAdmins FROM admins';
        try {
            const [result] = await db.query(query);
            return result[0].totalAdmins;
        } catch (err) {
            console.error('Error fetching total admins:', err);
            throw err;
        }
    },
    getTotalRoutes: async () => {
        const query = 'SELECT COUNT(*) AS totalRoutes FROM routes';
        try {
            const [result] = await db.query(query);
            return result[0].totalRoutes;
        } catch (err) {
            console.error('Error fetching total routes:', err);
            throw err;
        }
    }, getTotalDrivers: async () => {
        const query = 'SELECT COUNT(*) AS totalDrivers FROM drivers';
        try {
            const [result] = await db.query(query);
            return result[0].totalDrivers;
        } catch (err) {
            console.error('Error fetching total drivers:', err);
            throw err;
        }
    },
    getTotalRevenue: async () => {
        const query = 'SELECT sum(expense) AS totalRevenue FROM clients';
        try {
            const [result] = await db.query(query);
            return result[0].totalRevenue;
        } catch (err) {
            console.error('Error fetching total admins:', err);
            throw err;
        }
    },
}




module.exports = {
    createAdmin,
    dashboard,
    driver,
    coach,
    route,
    client,
    booking
};