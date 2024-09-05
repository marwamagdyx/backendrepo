
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Chat from '../models/chat';


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const register = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
        });

        const savedUser = await newUser.save();

        // Optionally, create a default chat for the user
        const chat = new Chat({
            participants: [savedUser._id],
            messages: []
        });
        await chat.save();

        const token = jwt.sign({ userId: savedUser._id}, JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                username: savedUser.username,
                email: savedUser.email,
            },
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
export const login = async (req: Request, res: Response) => {
  const { firstname,lastname,email, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);


      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      // Send token and user info
      res.json({ token, user: { id: user._id, firstName:user.firstName, lastName:user.lastName ,email: user.email, username: user.get('username') } });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};
export const logout = (req: Request, res: Response) => {
    try {
        // If using cookies to store tokens
        res.clearCookie('token'); // Clear the JWT cookie
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};