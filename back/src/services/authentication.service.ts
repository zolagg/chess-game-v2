import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';

class AuthenticationService {
  async register(username: string, password: string) {
    // Check if username already exists
    const existingUser = await User.findOne({
      where: { username }
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      password: hashedPassword
    });

    return user;
  }

  async authenticate(username: string, password: string) {
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return token;
  }
}

export const authService = new AuthenticationService();
