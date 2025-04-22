import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from '../src/config/connect.js';
import { authRoutes, VariablesRoutes } from '../src/routes/index.js';
import errorHandler from '../src/middlewares/errorHandler.js';
import CustomErrorHandler from '../src/utils/CustomErrorHandler.js';
import serverless from 'serverless-http';

dotenv.config();

const app = express();

console.log("⚙️ Initializing Express app...");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', VariablesRoutes);

app.get('/', (req, res) => {
  res.send('<h1>✅ Express on Vercel is working!</h1>');
});

app.use((err, req, res, next) => {
  console.error("🔥 Custom error middleware caught an error:", err);
  if (err instanceof CustomErrorHandler) {
    return res.status(err.status).json({ message: err.message, status: err.status });
  }
  res.status(500).json({ message: 'Something went wrong!', status: 500 });
});

app.use(errorHandler);

console.log("🔌 Connecting to MongoDB...");

await connect(process.env.DATABASE_URL || 'fallback');

console.log("✅ MongoDB connected.");

export default serverless(app);
