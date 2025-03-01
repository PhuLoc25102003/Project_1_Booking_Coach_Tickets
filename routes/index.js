const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

// Middleware kiểm tra session
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/Login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.type !== 'admin') {
        return res.redirect('/Login');
    }
    next();
};

// Routes
router.get('/', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'homepage.html'));
});

router.get('/admin', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'Admin.html'));
});

router.get('/Login', (req, res) => {
    if (req.session.user) {
        if (req.session.user.type === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/');
        }
    }
    res.sendFile(path.join(__dirname, '../views', 'LoginAndRegister.html'));
});

router.get('/booking', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'booking.html'));
});

router.get('/AddRoute', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'AddRoute.html'));
});

// API routes
router.post('/register-client', userController.registerClient);
router.post('/login', authController.login);
router.get('/check-session', authController.checkSession);
router.post('/logout', authController.logout);

// Driver routes
router.post('/add-driver', requireAdmin, adminController.driver.addDriver);
router.get('/drivers', requireAdmin, adminController.driver.getDrivers);
router.post('/deleteDriver', requireAdmin, adminController.driver.deleteDriver);
router.post('/edit-driver', requireAdmin, adminController.driver.updateDriver);
router.get('/search-drivers', requireAdmin, adminController.driver.searchDrivers);

// Coach routes
router.post('/add-coach', requireAdmin, adminController.coach.addCoach);
router.get('/coaches', requireAdmin, adminController.coach.getCoaches);
router.post('/deleteCoach', requireAdmin, adminController.coach.deleteCoach);
router.post('/update-coach', requireAdmin, adminController.coach.updateCoach);
router.get('/search-coaches', requireAdmin, adminController.coach.searchCoaches);

// Route routes
router.post('/add-route', requireAdmin, adminController.route.addRoute);
router.get('/routes', adminController.route.getRoutes); // Có thể không cần requireAdmin nếu user cũng cần xem
router.post('/deleteRoute', requireAdmin, adminController.route.deleteRoute);
router.post('/update-route', requireAdmin, adminController.route.updateRoute);
router.get('/search-routes', adminController.route.searchRoutes); // Có thể không cần requireAdmin

// Client routes
router.get('/clients', requireAdmin, adminController.client.getClients);
router.post('/add-client', requireAdmin, adminController.client.addClient);
router.post('/deleteClient', requireAdmin, adminController.client.deleteClient);
router.post('/update-client', requireAdmin, adminController.client.updateClient);
router.get('/search-clients', requireAdmin, adminController.client.searchClients);

// Booking routes
router.post('/add-booking', requireLogin, adminController.booking.addBooking);
router.get('/get-booked-seats', adminController.booking.getBookedList);
router.get('/bookings', requireAdmin, adminController.booking.getBookings);
router.post('/update-booking-status', requireAdmin, adminController.booking.updateBookingStatus);

// Admin registration and dashboard
router.post('/register-admin', requireAdmin, adminController.registerAdmin);
router.get('/totalDrivers', requireAdmin, adminController.dashboard.getTotalDrivers);
router.get('/totalCoaches', requireAdmin, adminController.dashboard.getTotalCoaches);
router.get('/totalClients', requireAdmin, adminController.dashboard.getTotalClients);
router.get('/totalRoutes', requireAdmin, adminController.dashboard.getTotalRoutes);
router.get('/totalAdmins', requireAdmin, adminController.dashboard.getTotalAdmins);

module.exports = router;