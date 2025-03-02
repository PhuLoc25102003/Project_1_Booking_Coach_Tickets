const userModel = require('../models/userModels');


const registerClient = async (req, res) => {
  const { username, password, confirmPassword, name, email, phoneNumber } = req.body;
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
      const newClient = await userModel.createClient(username, password, name, email, phoneNumber);
      return res.status(201).json({ message: 'Registering a client successfully!' });
    }

  } catch (error) {
    res.status(501).json({ message: 'Error registering', error });
  }
}

const updateUserProfile = async (req, res) => {
  const { fullName, email, phone } = req.body;
  const clientId = req.session.user?.id;

  if (!clientId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await userModel.updateUserProfile(clientId, { fullName, email, phone });
    // Cập nhật session
    req.session.user.name = fullName;
    req.session.user.email = email;
    req.session.user.phone = phone;
    console.log('Updated session:', req.session.user);
    res.status(200).json({
      message: 'Profile updated successfully',
      name: fullName,
      email: email,
      phone: phone
    });
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
const getUserBookings = async (req, res) => {
  const clientId = req.session.user?.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  if (!clientId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const { bookings, totalPages } = await userModel.getUserBookings(clientId, page, limit);
    res.status(200).json({ bookings, totalPages, currentPage: page });
  } catch (err) {
    console.error('Error in getUserBookings:', err);
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};
const changePassword = async (req, res) => {
  const { id, currentPassword, newPassword } = req.body;
  const clientId = req.session.user?.id;

  console.log('Received data:', { id, currentPassword, newPassword }); // Thêm log
  console.log('Session clientId:', clientId);
  if (!clientId || parseInt(clientId) !== parseInt(id)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await userModel.changePassword(clientId, currentPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error in changePassword:', err);
    res.status(400).json({ message: err.message || 'Error changing password' });
  }
};;

module.exports = {
  registerClient,
  updateUserProfile,
  getUserBookings,
  changePassword
} 