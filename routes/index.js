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


router.post('/add-driver', adminController.addDriver);

router.post('/register-client', userController.registerClient);

router.post('/login', userController.login);

router.get('/showDrivers', adminController.getAllDrivers);

router.post('/deleteDriver', adminController.deleteDriver);

router.post('/update-driver', adminController.updateDriver);


router.post('/add-coach', adminController.addCoach);

router.get('/showCoaches', adminController.getAllCoaches);

router.get('/get-coaches', adminController.getAllCoaches);

router.post('/deleteCoach', adminController.deleteCoach);

router.post('/update-coach', adminController.updateCoach);


router.post('/add-route', adminController.addRoute);

router.get('/showRoutes', adminController.getAllRoutes);

router.post('/deleteRoute', adminController.deleteRoute);

router.post('/update-route', adminController.updateRoute);


router.get('/showClients', adminController.getAllClients);
router.post('/add-client', adminController.addClient);
router.post('/deleteClient', adminController.deleteClient);
router.post('/update-client', adminController.updateClient);



router.post('/register-admin', adminController.registerAdmin);



module.exports = router;