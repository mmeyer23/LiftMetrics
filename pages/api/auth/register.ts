import { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit } from '../../../lib/rateLimit';
import { getCollection } from '../../../lib/db'; // Assuming you're using MongoDB
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const ipAddress =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Use the real IP address

    // Check rate limit for the IP address (or user)
    const isAllowed = checkRateLimit(ipAddress as string);
    if (!isAllowed) {
      return res
        .status(429)
        .json({
          error: 'Too many registration attempts. Please try again later.',
        });
    }

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required!' });
    }

    const usersCollection = await getCollection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        email,
        password: hashedPassword,
      };

      const result = await usersCollection.insertOne(newUser);

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }

      const token = jwt.sign(
        { userId: result.insertedId.toString() },
        jwtSecret,
        { expiresIn: '1h' }
      );

      res.status(201).json({ token });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
