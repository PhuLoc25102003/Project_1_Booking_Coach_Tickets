const userModel = require('../models/userModels');


// Hàm kiểm tra đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;
  try {

    let user = await userModel.findUserByUsername(username);
    
    if (!user) {
      user = await userModel.findAdminByUsername(username);
      if (user && user.admin_password === password) {
    
        return res.status(200).json({ message: 'Login successfully', type: 'admin' });
      } else {
  
        return res.status(400).json({ message: 'Username or password is incorrect!' });
      }
    }

    if (user.client_password === password) {
      return res.status(200).json({ message: 'Login successfully', type: 'user' });
    } else {
      return res.status(400).json({ message: 'Username or password is incorrect!' });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};


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
  login,
  registerClient,

} 