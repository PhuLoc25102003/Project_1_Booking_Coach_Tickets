const express = require('express');
const router = express.Router();
const path = require('path');

// Route cho trang chủ ('/')
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'homepage.html'));
});

// Route cho trang đặt vé ('/booking')
router.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'booking.html'));
});

router.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'LoginAndRegister.html'));
});



module.exports = router;