export const config = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  port: process.env.PORT || 8000
}; 