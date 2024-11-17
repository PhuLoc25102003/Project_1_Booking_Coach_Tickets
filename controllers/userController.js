const userModel = require('../models/userModels');


// Hàm kiểm tra đăng nhập
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);

    if (user && user.password === password) {
      return res.status(200).json({ message: 'Login successfully' });
    } else {

      return res.status(400).json({ message: 'Username or password is incorrect!' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    const routes = await userModel.fetchRoute();
    return res.status(200).json(routes);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching routes', error });
  }
};


const register = async (req, res) => {
  const { username, password, confirmPassword, name, email, phoneNumber } = req.body;
  try {
    const user = await userModel.findUserByUsername(username);
    if (user) {
      return res.status(401).json({ message: 'Username already exists!' });
    }
    if (password !== confirmPassword) {
      return res.status(404).json({ message: `The confirmation password does not match.` });
    }
    if (!user) {
      const newAccount = await userModel.createAccount(username, password);
      const clientId = newAccount.client_id;
      // Now create the corresponding client using the same clientId
      const newClient = await userModel.createClient(clientId, name, email, phoneNumber);
      return res.status(201).json({ message: 'Registering successfully!' });
    }

    // Create the account
  } catch (error) {
    res.status(501).json({ message: 'Error registering', error });
  }
}


const addRoute = async (req, res) => {
  const { coachName, coachOperator, departureTime, arrivalTime, departurePoint, arrivalPoint } = req.body;
  try {
    const addRoute = await userModel.createRoute(coachName, coachOperator, departureTime, arrivalTime, departurePoint, arrivalPoint);
    return res.status(200).json({ message: 'Add route successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};


module.exports = {
  login,
  register,
  addRoute, 
  getAllRoutes,

} 