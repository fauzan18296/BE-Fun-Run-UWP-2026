import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';


export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Simple admin check (in production, use database)
    const isValid = username === process.env.ADMIN_USERNAME && 
                   await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    });

  } catch (error) {
    next(error);
  }
};

export const verifyToken = (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};