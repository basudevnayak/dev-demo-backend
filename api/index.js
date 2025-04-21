import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRoutes, VariablesRoutes } from '../routes/index.js';
import errorHandler from '../middlewares/errorHandler.js';
import CustomErrorHandler from '../utils/CustomErrorHandler.js';
import { connect } from '../config/connect.js';
import { DATABASE_URL } from '../config/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/variables', VariablesRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to E-commerce API on Vercel</h1>');
});

app.use(errorHandler);

// Connect DB (optional, make sure this doesn't reconnect on every call)
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    await connect(DATABASE_URL);
    isConnected = true;
  }
  next();
});

// Export as serverless function
export default serverless(app);
