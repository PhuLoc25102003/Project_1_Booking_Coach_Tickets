const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'homepage.html'));
});

router.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'booking.html'));
});

router.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'LoginAndRegister.html'));
});

router.get('/AddRoute', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'AddRoute.html'));
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'Admin.html'));
});


router.post('/register-client', userController.registerClient);

router.post('/login', userController.login);

//Driver_function
router.post('/add-driver', adminController.driver.addDriver);
router.get('/drivers', adminController.driver.getDrivers);
router.post('/deleteDriver', adminController.driver.deleteDriver);
router.post('/edit-driver', adminController.driver.updateDriver);
router.get('/search-drivers', adminController.driver.searchDrivers);


//Coach_function
router.post('/add-coach', adminController.coach.addCoach);
router.get('/coaches', adminController.coach.getCoaches);
router.post('/deleteCoach', adminController.coach.deleteCoach);
router.post('/update-coach', adminController.coach.updateCoach);
router.get('/search-coaches', adminController.coach.searchCoaches);

//Route_function
router.post('/add-route', adminController.route.addRoute);
router.get('/routes', adminController.route.getRoutes);
router.post('/deleteRoute', adminController.route.deleteRoute);
router.post('/update-route', adminController.route.updateRoute);
router.get('/search-routes', adminController.route.searchRoutes);


//Client_function
router.get('/clients', adminController.client.getClients);
router.post('/add-client', adminController.client.addClient);
router.post('/deleteClient', adminController.client.deleteClient);
router.post('/update-client', adminController.client.updateClient);
router.get('/search-clients', adminController.client.searchClients);


//Booking_function
router.post('/add-booking', adminController.booking.addBooking);
router.get('/get-booked-seats', adminController.booking.getBookedList);
router.get('/bookings', adminController.booking.getBookings);
router.post('/update-booking-status', adminController.booking.updateBookingStatus);


router.post('/register-admin', adminController.registerAdmin);
router.get('/totalDrivers', adminController.dashboard.getTotalDrivers);
router.get('/totalCoaches', adminController.dashboard.getTotalCoaches);
router.get('/totalClients', adminController.dashboard.getTotalClients);
router.get('/totalRoutes', adminController.dashboard.getTotalRoutes);
router.get('/totalAdmins', adminController.dashboard.getTotalAdmins);


module.exports = router;