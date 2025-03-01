const adminModel = require('../models/adminModels');
const userModel = require('../models/userModels');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Driver_function
const driver = {
    addDriver: async (req, res) => {
        const { name, phone, license } = req.body;
        try {
            const driverId = await adminModel.driver.addDriver(name, phone, license);
            res.status(200).json({
                id: driverId,
                name: name,
                phone: phone,
                license: license
            });
        } catch (err) {
            res.status(500).send('Error adding driver to the database');
        }
    },
    deleteDriver: async (req, res) => {
        const driverId = req.body.id;
        try {
            const result = await adminModel.driver.deleteDriverById(driverId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Driver not found' });
            }
            return res.status(200).json({ message: 'Driver deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting driver', error });
        }
    },
    getDrivers: async (req, res) => {
        try {
            const limit = Number.isInteger(parseInt(req.query.length)) ? parseInt(req.query.length) : 10;
            const offset = Number.isInteger(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
            const searchValue = req.query.search?.value || '';
            const orderColumnIndex = req.query.order?.[0]?.column || 0;
            const orderDir = req.query.order?.[0]?.dir === 'desc' ? 'DESC' : 'ASC';

            const columns = ['driver_id', 'driver_name', 'phone', 'license_number'];
            const orderColumn = columns[orderColumnIndex] || 'driver_id';

            const result = await adminModel.driver.getDrivers(limit, offset, searchValue, orderColumn, orderDir);
            res.json({
                draw: parseInt(req.query.draw) || 1,
                recordsTotal: result.total,
                recordsFiltered: result.filtered,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: 'Database error' });
        }
    },
    updateDriver: async (req, res) => {
        const { id, name, phone, license } = req.body;

        if (!name || !phone || !license) {
            return res.status(400).send('All fields are required.');
        }
        try {
            await adminModel.driver.updateDriver(id, name, phone, license);
            res.status(200).send('Driver updated successfully.');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating driver.');
        }
    },
    searchDrivers: async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Missing search query' });
        }
        try {
            const drivers = await adminModel.driver.searchDrivers(query);
            res.json(drivers);
        } catch (err) {
            res.status(500).json({ error: 'Database query failed' });
        }
    },

}



// Coach_function
const coach = {
    getCoaches: async (req, res) => {
        try {
            const limit = Number.isInteger(parseInt(req.query.length)) ? parseInt(req.query.length) : 10;
            const offset = Number.isInteger(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
            const searchValue = req.query.search?.value || '';
            const orderColumnIndex = req.query.order?.[0]?.column || 0;
            const orderDir = req.query.order?.[0]?.dir === 'desc' ? 'DESC' : 'ASC';

            const columns = ['coach_id', 'coach_type', 'seats', 'license_plate', 'driver_name', 'coach_operator'];
            const orderColumn = columns[orderColumnIndex] || 'coach_id';

            const result = await adminModel.coach.getCoaches(limit, offset, searchValue, orderColumn, orderDir);
            console.log(result);

            res.json({
                draw: parseInt(req.query.draw) || 1,
                recordsTotal: result.total,
                recordsFiltered: result.filtered,
                data: result.data
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Database error' });
        }
    },

    searchCoaches: async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Missing search query' });
        }
        try {
            const coaches = await adminModel.coach.searchCoaches(query);
            res.json(coaches);
        } catch (err) {
            res.status(500).json({ error: 'Database query failed' });
        }
    },


    addCoach: async (req, res) => {
        const { type, seat, license, operator, driverId } = req.body;

        try {
            const coachId = await adminModel.coach.addCoach(type, seat, license, operator, driverId);
            res.status(200).json({
                id: coachId,
                type: type,
                seat: seat,
                license: license,
                operator: operator,
                driverId: driverId
            });
        } catch (err) {
            console.error('Error adding coach to the database:', err);
            res.status(500).send('Error adding coach to the database');
        }
    },


    deleteCoach: async (req, res) => {
        const coachId = req.body.id;

        try {
            const result = await adminModel.coach.deleteCoachById(coachId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Coach not found' });
            }
            return res.status(200).json({ message: 'Coach deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting coach', error });
        }
    },

    updateCoach: async (req, res) => {
        const { id, type, seats, license, operator } = req.body;

        if (!type || !seats || !license || !operator) {
            return res.status(400).send('All fields are required.');
        }

        try {
            await adminModel.coach.updateCoach(id, type, seats, license, operator);
            res.status(200).send('Coach updated successfully.');
        } catch (err) {
            console.error('Error updating coach:', err);
            res.status(500).send('Error updating Coach.');
        }
    },

}






// Route_function
const route = {
    addRoute: async (req, res) => {
        const { departureTime, arrivalTime, departurePoint, arrivalPoint, license, price } = req.body;

        try {
            const routeId = await adminModel.route.addRoute(departureTime, arrivalTime, departurePoint, arrivalPoint, license, price);
            res.status(200).json({
                id: routeId,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                departurePoint: departurePoint,
                arrivalPoint: arrivalPoint,
                license: license,
                price: price
            });
        } catch (err) {
            console.error('Error adding a route to the database:', err);
            res.status(500).send('Error adding a route to the database');
        }
    },

    getRoutes: async (req, res) => {
        try {
            const limit = Number.isInteger(parseInt(req.query.length)) ? parseInt(req.query.length) : 10;
            const offset = Number.isInteger(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
            const searchValue = req.query.search?.value || '';
            const orderColumnIndex = req.query.order?.[0]?.column || 0;
            const orderDir = req.query.order?.[0]?.dir === 'desc' ? 'DESC' : 'ASC';

            const columns = ['route_id', 'coach_license_plate', 'departure_time', 'arrival_time', 'departure_point', 'arrival_point', 'price'];
            const orderColumn = columns[orderColumnIndex];

            const result = await adminModel.route.getRoutes(limit, offset, searchValue, orderColumn, orderDir);

            res.json({
                draw: parseInt(req.query.draw) || 1,
                recordsTotal: result.total,
                recordsFiltered: result.filtered,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: 'Database error' });
        }
    },



    deleteRoute: async (req, res) => {
        const routeId = req.body.id;

        try {
            const result = await adminModel.route.deleteRouteById(routeId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Route not found' });
            }
            return res.status(200).json({ message: 'Route deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting coach', error });
        }
    },

    updateRoute: async (req, res) => {
        const { routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, price } = req.body;

        console.log('Received update data:', { routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, price }); // Debug

        if (!routeId || !license || !departureTime || !arrivalTime || !departurePoint || !arrivalPoint || !price) {
            return res.status(400).send('All fields are required, including routeId.');
        }

        try {
            const result = await adminModel.route.updateRoute(routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, price);
            if (result.affectedRows === 0) {
                return res.status(404).send('Route not found or no changes made.');
            }
            res.status(200).send('Route updated successfully.');
        } catch (err) {
            console.error('Error updating route:', err);
            res.status(500).send('Error updating route: ' + err.message);
        }
    },
    searchRoutes: async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Missing search query' });
        }
        try {
            const routes = await adminModel.booking.searchRoutes(query);
            res.json(routes);
        } catch (err) {
            res.status(500).json({ error: 'Database query failed' });
        }
    },

}




// Client_function
const client = {
    getClients: async (req, res) => {
        try {
            const limit = Number.isInteger(parseInt(req.query.length)) ? parseInt(req.query.length) : 10;
            const offset = Number.isInteger(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
            const searchValue = req.query.search?.value || '';
            const orderColumnIndex = req.query.order?.[0]?.column || 0;
            const orderDir = req.query.order?.[0]?.dir === 'desc' ? 'DESC' : 'ASC';

            const columns = ['client_id', 'client_name', 'phone_number', 'email', 'rank', 'expense'];
            const orderColumn = columns[orderColumnIndex];

            const result = await adminModel.client.getClients(limit, offset, searchValue, orderColumn, orderDir);

            res.json({
                draw: parseInt(req.query.draw) || 1,
                recordsTotal: result.total,
                recordsFiltered: result.filtered,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({ error: 'Database error' });
        }
    },

    addClient: async (req, res) => {
        const { clientName, clientPhoneNumber, clientEmail } = req.body;

        try {
            const clientId = await adminModel.client.addClient(clientName, clientPhoneNumber, clientEmail);
            res.status(200).json({
                id: clientId,
                clientName: clientName,
                clientPhoneNumber: clientPhoneNumber,
                clientEmail: clientEmail,
            });
        } catch (err) {
            console.error('Error adding a client to the database:', err);
            res.status(500).send('Error adding a client to the database');
        }
    },

    deleteClient: async (req, res) => {
        const clientId = req.body.id;

        try {
            const result = await adminModel.client.deleteClientById(clientId);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Client not found' });
            }
            return res.status(200).json({ message: 'The client deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting the client', error });
        }
    },

    updateClient: async (req, res) => {
        const { clientId, clientName, clientPhoneNumber, clientEmail } = req.body;

        if (!clientEmail || !clientName || !clientPhoneNumber) {
            return res.status(400).send('All fields are required.');
        }

        try {
            await adminModel.client.updateClient(clientId, clientName, clientPhoneNumber, clientEmail);
            res.status(200).send('The Client updated successfully.');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating the client.');
        }
    },
    searchClients: async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: 'Missing search query' });
        }
        try {
            const clients = await adminModel.booking.searchClients(query);
            res.json(clients);
        } catch (err) {
            res.status(500).json({ error: 'Database query failed' });
        }
    },

}




// Admin
const registerAdmin = async (req, res) => {
    const { username, password, confirmPassword, name } = req.body;

    try {
        const client = await userModel.findUserByUsername(username);
        const admin = await userModel.findAdminByUsername(username);
        if (client || admin) {
            return res.status(401).json({ message: 'Username already exists!' });
        }
        if (password !== confirmPassword) {
            return res.status(404).json({ message: `The confirmation password does not match.` });
        }
        if (!client && !admin) {
            const newAdmin = await adminModel.createAdmin(username, password, name);
            return res.status(201).json({ message: 'Registering an admin successfully!' });
        }

    } catch (error) {
        res.status(501).json({ message: 'Error registering', error });
    }
}



// Booking_funcion
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bookingcoachtickets@gmail.com',
        pass: 'lmut udnd tfuj ktak'
    }
});

const booking = {
    getBookings: async (req, res) => {
        try {
            const limit = Number.isInteger(parseInt(req.query.length)) ? parseInt(req.query.length) : 10;
            const offset = Number.isInteger(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
            const searchValue = req.query.search?.value || '';
            const orderColumnIndex = req.query.order?.[0]?.column || 0;
            const orderDir = req.query.order?.[0]?.dir === 'desc' ? 'DESC' : 'ASC';

            const columns = [
                'b.booking_id',
                'c.client_name',
                'b.seat_number',
                'b.booking_date',
                'b.order_status'
            ];
            const orderColumn = columns[orderColumnIndex] || 'b.booking_id';

            const result = await adminModel.booking.getBookings(limit, offset, searchValue, orderColumn, orderDir);

            res.json({
                draw: parseInt(req.query.draw) || 1,
                recordsTotal: result.total,
                recordsFiltered: result.filtered,
                data: result.data
            });
        } catch (error) {
            console.error('Error in getBookings controller:', error);
            res.status(500).json({ error: 'Database error: ' + error.message });
        }
    },
    getBookedList: async (req, res) => {
        const { routeId, bookingDate } = req.query;
        console.log('Received request:', { routeId, bookingDate }); // Debug

        if (!routeId) {
            return res.status(400).json({ error: 'Missing routeId' });
        }

        try {
            const bookedSeats = await adminModel.booking.getBookedList(routeId, bookingDate);
            console.log('Sending booked seats:', bookedSeats);
            res.status(200).json(bookedSeats);
        } catch (err) {
            console.error('Error in getBookedList:', err);
            res.status(500).json({ error: 'Error getting booked list: ' + err.message });
        }
    },

    addBooking: async (req, res) => {
        const { clientId, routeId, departureDate, price, seatNumber } = req.body;

        console.log('Received booking data:', { clientId, routeId, departureDate, price, seatNumber });

        if (!clientId || !routeId || !departureDate || !price || !seatNumber) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const bookingId = `B${Date.now()}`;
            const orderStatus = 'in process';

            console.log('Adding booking with ID:', bookingId);
            await adminModel.booking.addBooking(bookingId, routeId, clientId, departureDate, price, seatNumber, orderStatus);

            console.log('Fetching booking details for:', bookingId);
            const bookingDetails = await adminModel.booking.getBookingDetails(bookingId);

            const mailOptions = {
                from: 'your-email@gmail.com',
                to: bookingDetails.email,
                subject: 'Xác nhận đặt vé xe - Mã vé: ' + bookingId,
                html: `
                    <h2>Xác nhận đặt vé xe</h2>
                    <p>Kính gửi ${bookingDetails.client_name},</p>
                    <p>Chúng tôi xin xác nhận thông tin đặt vé của bạn như sau:</p>
                    <ul>
                        <li><strong>Mã vé:</strong> ${bookingId}</li>
                        <li><strong>Tuyến đường:</strong> ${bookingDetails.departure_point} -> ${bookingDetails.arrival_point}</li>
                        <li><strong>Thời gian khởi hành:</strong> ${bookingDetails.departure_time}</li>
                        <li><strong>Số ghế:</strong> ${seatNumber}</li>
                        <li><strong>Giá tiền:</strong> ${price} VND</li>
                        <li><strong>Trạng thái:</strong> ${orderStatus}</li>
                    </ul>
                    <p>Vui lòng kiểm tra thông tin và thanh toán trong vòng 30 phút để tránh bị hủy tự động.</p>
                    <p>Trân trọng,<br>Đội ngũ Booking Coach Tickets</p>
                `
            };

            await transporter.sendMail(mailOptions);

            res.status(201).json({ message: 'Booking added successfully and email sent', bookingId });
        } catch (err) {
            console.error('Error in addBooking:', err.message, err.stack);
            res.status(500).json({ error: 'Error adding booking: ' + err.message });
        }
    },

    checkAndCancelExpiredBookings: async () => {
        try {
            const currentTime = new Date();
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            const formattedCurrentTime = formatDate(currentTime);
            const formattedThirtyMinutesAgo = formatDate(thirtyMinutesAgo);

            console.log('Current server time:', formattedCurrentTime);
            console.log('Threshold time (30 minutes ago):', formattedThirtyMinutesAgo);

            const expiredBookings = await adminModel.booking.getExpiredBookings(formattedThirtyMinutesAgo);

            console.log('Number of expired bookings found:', expiredBookings.length);

            if (expiredBookings.length === 0) {
                console.log('No bookings to cancel.');
                return;
            }

            for (const booking of expiredBookings) {
                await adminModel.booking.updateBookingStatus(booking.booking_id, 'cancelled');
                console.log(`Booking ${booking.booking_id} cancelled due to expiration (30 minutes)`);
            }
        } catch (err) {
            console.error('Error in checkAndCancelExpiredBookings:', err.message, err.stack);
        }
    },
    updateBookingStatus: async (req, res) => {
        const { bookingId, orderStatus } = req.body;

        console.log('Received update request:', { bookingId, orderStatus });

        if (!bookingId || !orderStatus) {
            return res.status(400).json({ error: 'Missing bookingId or orderStatus' });
        }

        if (!['in process', 'cancelled', 'paid'].includes(orderStatus)) {
            return res.status(400).json({ error: 'Invalid orderStatus value' });
        }

        try {
            await adminModel.booking.updateBookingStatus(bookingId, orderStatus);
            res.status(200).json({ message: `Booking status updated to ${orderStatus}` });
        } catch (err) {
            console.error('Error in updateBookingStatus:', err);
            res.status(500).json({ error: 'Error updating booking status: ' + err.message });
        }
    },

}
cron.schedule('* * * * *', () => {
    console.log('Checking expired bookings...');
    booking.checkAndCancelExpiredBookings();
});




const dashboard = {
     getTotalCoaches: async (req, res) => {
        try {
            const totalCoaches = await adminModel.dashboard.getTotalCoaches();
            res.status(200).json({ totalCoaches });
        } catch (err) {
            console.error('Error in getTotalCoaches controller:', err);
            res.status(500).json({ error: 'Failed to fetch total coaches' });
        }
    },
    
     getTotalClients: async (req, res) => {
        try {
            const totalClients = await adminModel.dashboard.getTotalClients();
            res.status(200).json({ totalClients });
        } catch (err) {
            console.error('Error in getTotalClients controller:', err);
            res.status(500).json({ error: 'Failed to fetch total clients' });
        }
    },

     getTotalAdmins: async (req, res) => {
        try {
            const totalAdmins = await adminModel.dashboard.getTotalAdmins();
            res.status(200).json({ totalAdmins });
        } catch (err) {
            console.error('Error in getTotalAdmins controller:', err);
            res.status(500).json({ error: 'Failed to fetch total admins' });
        }
    },
     getTotalRoutes: async (req, res) => {
        try {
            const totalRoutes = await adminModel.dashboard.getTotalRoutes();
            res.status(200).json({ totalRoutes });
        } catch (err) {
            console.error('Error in getTotalRoutes controller:', err);
            res.status(500).json({ error: 'Failed to fetch total routes' });
        }
    },
     getTotalDrivers: async (req, res) => {
        try {
            const totalDrivers = await adminModel.dashboard.getTotalDrivers();
            return res.status(200).json({ totalDrivers });
        } catch (err) {
            console.error('Error in getTotalDrivers controller:', err);
            return res.status(500).json({ error: 'Failed to fetch total drivers' });
        }
    },

}




module.exports = {
    driver,
    coach,
    route,
    client,
    booking,
    dashboard,
    registerAdmin,
};