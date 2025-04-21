import dotenv from 'dotenv';
dotenv.config();

// ✅ Destructure safely AFTER dotenv.config()
export const {
    PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL,
    DATABASE_URL
} = process.env;

