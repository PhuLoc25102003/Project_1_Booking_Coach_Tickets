const userModel = require('../models/userModels');


// Hàm kiểm tra đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);

    if (user && user.password === password) {

      return res.status(200).json({ message: 'Đăng nhập thành công' });
    } else {

      return res.status(400).json({ message: 'Tài khoản hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};

const register = async (req, res) => {
  const { username, password, confirmPassword, name, email, phoneNumber } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);
    if (user) {
      return res.status(401).json({ message: 'Tài khoản đã tồn tại.' });
    }
    if (password !== confirmPassword) {
      return res.status(404).json({ message: `Mật khẩu xác nhận không trùng khớp. ${confirmPassword}, ${password}` });
    }
    if (!user) {
      const newAccount = await userModel.createAccount(username, password);
      const clientId = newAccount.client_id;
      // Now create the corresponding client using the same clientId
      const newClient = await userModel.createClient(clientId, name, email, phoneNumber);
      return res.status(201).json({ message: 'Đăng ký thành công' });
    }

    // Create the account
  } catch (error) {
    res.status(501).json({ message: 'Error registering', error });
  }
}


module.exports = {
  login,
  register

} 