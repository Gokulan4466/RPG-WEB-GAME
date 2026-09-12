import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_liferpg_hackathon_2026',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  
  // Non-linear XP Formula: requiredXP(level) = Math.floor(100 * Math.pow(level, 1.5))
  xpFormula: (level: number): number => {
    return Math.floor(100 * Math.pow(level, 1.5));
  },
};
