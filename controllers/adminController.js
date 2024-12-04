const adminModel = require('../models/adminModels');
const userModel = require('../models/userModels');


// Driver
const addDriver = async (req, res) => {
    const { name, phone, license } = req.body;
    try {
        const driverId = await adminModel.addDriver(name, phone, license);
        res.status(200).json({
            id: driverId,
            name: name,
            phone: phone,
            license: license
        });
    } catch (err) {
        res.status(500).send('Error adding driver to the database');
    }
};



const deleteDriver = async (req, res) => {
    const driverId = req.body.id;

    try {
        const result = await adminModel.deleteDriverById(driverId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        return res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting driver', error });
    }
};

const getAllDrivers = async (req, res) => {
    try {
        const drivers = await adminModel.fetchDriver();
        return res.status(200).json(drivers);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching routes', error });
    }
};


const updateDriver = async (req, res) => {
    const { id, name, phone, license } = req.body;

    if (!name || !phone || !license) {
        return res.status(400).send('All fields are required.');
    }

    try {

        await adminModel.updateDriver(id, name, phone, license);


        res.status(200).send('Driver updated successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating driver.');
    }
};




// Coach

const searchCoaches = async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    try {
        const coaches = await adminModel.searchCoaches(query); 
        res.json(coaches);
    } catch (err) {
        res.status(500).json({ error: 'Database query failed' });
    }
};


const addCoach = async (req, res) => {
    const { type, seat, license, operator } = req.body;

    try {
        const coachId = await adminModel.addCoach(type, seat, license, operator);
        res.status(200).json({
            id: coachId,
            type: type,
            seat: seat,
            license: license,
            operator: operator
        });
    } catch (err) {
        console.error('Error adding coach to the database:', err); // Thêm log để debug
        res.status(500).send('Error adding coach to the database');
    }
};

const getAllCoaches = async (req, res) => {
    try {
        const coaches = await adminModel.fetchCoach();
        return res.status(200).json(coaches);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching coaches', error });
    }
};

const deleteCoach = async (req, res) => {
    const coachId = req.body.id;

    try {
        const result = await adminModel.deleteCoachById(coachId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Coach not found' });
        }
        return res.status(200).json({ message: 'Coach deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting coach', error });
    }
};

const updateCoach = async (req, res) => {
    const { id, type, seats, license, operator } = req.body;

    if (!type || !seats || !license || !operator) {
        return res.status(400).send('All fields are required.');
    }

    try {
        await adminModel.updateCoach(id, type, seats, license, operator);
        res.status(200).send('Coach updated successfully.');
    } catch (err) {
        console.error('Error updating coach:', err);
        res.status(500).send('Error updating Coach.');
    }
};





// Route

const addRoute = async (req, res) => {
    const { license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate } = req.body;

    try {
        const routeId = await adminModel.addRoute(license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate);
        res.status(200).json({
            id: routeId,
            license: license,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            departurePoint: departurePoint,
            arrivalPoint: arrivalPoint,
            routeDate: routeDate
        });
    } catch (err) {
        console.error('Error adding a route to the database:', err);
        res.status(500).send('Error adding a route to the database');
    }
};

const getAllRoutes = async (req, res) => {
    try {
        const route = await adminModel.fetchRoute();
        return res.status(200).json(route);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching Routes', error });
    }
};

const deleteRoute = async (req, res) => {
    const routeId = req.body.id;

    try {
        const result = await adminModel.deleteRouteById(routeId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Route not found' });
        }
        return res.status(200).json({ message: 'Route deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting coach', error });
    }
};

const updateRoute = async (req, res) => {
    const { routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate } = req.body;

    if (!license || !departureTime || !arrivalTime || !departurePoint || !arrivalPoint || !routeDate) {
        return res.status(400).send('All fields are required.');
    }

    try {
        await adminModel.updateRoute(routeId, license, departureTime, arrivalTime, departurePoint, arrivalPoint, routeDate);
        res.status(200).send('Route updated successfully.');
    } catch (err) {
        console.error('Error updating coach:', err);
        res.status(500).send('Error updating Coach.');
    }
};



// Client

const getAllClients = async (req, res) => {
    try {
        const client = await adminModel.fetchClient();
        return res.status(200).json(client);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching Clients', error });
    }
};

const addClient = async (req, res) => {
    const { clientName, clientPhoneNumber, clientEmail } = req.body;

    try {
        const clientId = await adminModel.addRoute(clientName, clientPhoneNumber, clientEmail);
        res.status(200).json({
            id: clientId,
            clientName: clientName,
            clientPhoneNumber: clientPhoneNumber,
            clientEmail: clientEmail,
        });
    } catch (err) {
        console.error('Error adding a client to the database:', err);
        res.status(500).send('Error adding a client to the database');
    }
};

const deleteClient = async (req, res) => {
    const clientId = req.body.id;

    try {
        const result = await adminModel.deleteClientById(clientId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Client not found' });
        }
        return res.status(200).json({ message: 'The client deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting the client', error });
    }
};

const updateClient = async (req, res) => {
    const { clientId, clientName, clientPhoneNumber, clientEmail } = req.body;

    if (!clientEmail || !clientName || !clientPhoneNumber) {
        return res.status(400).send('All fields are required.');
    }

    try {

        await adminModel.updateClient(clientId, clientName, clientPhoneNumber, clientEmail);


        res.status(200).send('The Client updated successfully.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the client.');
    }
};







// admin

const registerAdmin = async (req, res) => {
    const { username, password, confirmPassword, name} = req.body;

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
        const newAdmin = await adminModel.createAdmin(username, password, name);
        return res.status(201).json({ message: 'Registering an admin successfully!' });
      }
  
    } catch (error) {
      res.status(501).json({ message: 'Error registering', error });
    }
  }
  




module.exports = { addDriver, getAllDrivers, deleteDriver, updateDriver, getAllCoaches, addCoach, deleteCoach, updateCoach, addRoute, getAllRoutes, deleteRoute, searchCoaches, updateRoute, getAllClients, addClient, registerAdmin, deleteClient, updateClient };