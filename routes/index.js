const express = require('express');
const router = express.Router();
const path = require('path');
const userControllers = require('../controllers/userController');

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

router.get('/ShowRoutes', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'ShowRoute.html'));
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'admin.html'));
});



router.post('/register', userControllers.register);

router.post('/login', userControllers.login);

router.post('/AddRoute', userControllers.addRoute);

router.get('/routes', userControllers.getAllRoutes);

module.exports = router;