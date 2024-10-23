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
  const { username, password, confirmPassword } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);
    if (user) {
      return res.status(401).json({ message: 'Tài khoản đã tồn tại.' });
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(402).json({ message: 'Mật khẩu xác nhận không trùng khớp.' });
    } 
      await userModel.createAccount(username, password);
      return res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
    // Create the account
  } catch (error) {
    res.status(501).json({ message: 'Error registering', error });
  }
}


module.exports = {
  login,
  register

} 