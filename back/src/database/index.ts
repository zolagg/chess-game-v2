import { Sequelize } from 'sequelize';

export const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Define User model
export const User = db.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

// Initialize database
export const initDatabase = async () => {
  try {
    await db.authenticate();
    console.log('Database connection established.');
    await db.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}; 