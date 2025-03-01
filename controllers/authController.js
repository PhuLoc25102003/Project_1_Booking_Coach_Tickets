const userModel = require('../models/userModels');
const session = require('express-session');


const sessionConfig = {
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false, 
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, 
        secure: false 
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await userModel.findUserByUsername(username);

        if (!user) {
            user = await userModel.findAdminByUsername(username);
            if (user && user.admin_password === password) {
                req.session.user = {
                    id: user.admin_id,
                    username: user.admin_username,
                    name: user.admin_name,
                    type: 'admin'
                };
                return res.status(200).json({ message: 'Login successfully', type: 'admin' });
            } else {
                return res.status(400).json({ message: 'Username or password is incorrect!' });
            }
        }

        if (user.client_password === password) {
            req.session.user = {
                id: user.client_id,
                username: user.client_username,
                name: user.client_name,
                type: 'user'
            };
            return res.status(200).json({ message: 'Login successfully', type: 'user' });
        } else {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const checkSession = (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ 
            loggedIn: true, 
            type: req.session.user.type, 
            name: req.session.user.name 
        });
    } else {
        return res.status(200).json({ loggedIn: false });
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logout successfully' });
    });
};



module.exports = { login, checkSession, logout, sessionConfig };