// api/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http';
import { connect } from '../src/config/connect.js'; // adjust if needed
import { authRoutes, VariablesRoutes } from '../src/routes/index.js';
import errorHandler from '../src/middlewares/errorHandler.js';
import CustomErrorHandler from '../src/utils/CustomErrorHandler.js';
import { DATABASE_URL } from '../src/config/index.js';

dotenv.config();

const app = express();

connect(DATABASE_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', VariablesRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to E-commerce Rest APIs</h1>');
});

app.use(errorHandler);

// ❌ Do NOT use app.listen()

// ✅ Export as serverless function
export default serverless(app);
