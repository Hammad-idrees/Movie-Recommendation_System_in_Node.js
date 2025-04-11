const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.status(200).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in admin', error: error.message });
  }
};

// Update admin details
exports.updateAdminDetails = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    if (password) {
      admin.password = password;
    }

    const updatedAdmin = await admin.save();

    res.status(200).json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin details', error: error.message });
  }
};

// Get admin details
exports.getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin details', error: error.message });
  }
};
// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    await Admin.findByIdAndDelete(req.admin.id);

    res.status(200).json({ message: 'Admin account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
};