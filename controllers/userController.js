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


module.exports = {
  registerClient
} 