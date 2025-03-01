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

router.get('/search-coaches', adminController.searchCoaches);

router.get('/search-drivers', adminController.searchDrivers);

router.post('/register-client', userController.registerClient);

router.post('/login', userController.login);

//Driver_function
router.post('/add-driver', adminController.addDriver);
router.get('/drivers', adminController.getDrivers);
router.post('/deleteDriver', adminController.deleteDriver);
router.post('/edit-driver', adminController.updateDriver);


//Coach_function
router.post('/add-coach', adminController.addCoach);
router.get('/coaches', adminController.getCoaches);
router.post('/deleteCoach', adminController.deleteCoach);
router.post('/update-coach', adminController.updateCoach);

//Route_function
router.post('/add-route', adminController.addRoute);
router.get('/routes', adminController.getRoutes);
router.post('/deleteRoute', adminController.deleteRoute);
router.post('/update-route', adminController.updateRoute);

//Client_function
router.get('/clients', adminController.getClients);
router.post('/add-client', adminController.addClient);
router.post('/deleteClient', adminController.deleteClient);
router.post('/update-client', adminController.updateClient);

//Booking_function
router.post('/add-booking', adminController.addBooking);
router.get('/search-clients', adminController.searchClients);
router.get('/search-routes', adminController.searchRoutes);
router.get('/get-booked-seats', adminController.getBookedList);
router.get('/bookings', adminController.getBookings);
router.post('/update-booking-status', adminController.updateBookingStatus);


router.post('/register-admin', adminController.registerAdmin);
router.get('/totalDrivers', adminController.getTotalDrivers);
router.get('/totalCoaches', adminController.getTotalCoaches);
router.get('/totalClients', adminController.getTotalClients);
router.get('/totalRoutes', adminController.getTotalRoutes);
router.get('/totalAdmins', adminController.getTotalAdmins);


module.exports = router;