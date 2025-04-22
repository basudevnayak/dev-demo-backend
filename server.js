import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connect } from './src/config/connect.js';
import { authRoutes, VariablesRoutes } from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';
import CustomErrorHandler from './src/utils/CustomErrorHandler.js';
import { DATABASE_URL } from './src/config/index.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Custom error handler for specific errors
app.use((err, req, res, next) => {
  if (err instanceof CustomErrorHandler) {
    return res.status(err.status).json({
      message: err.message,
      status: err.status,
    });
  }

  return res.status(500).json({
    message: 'Something went wrong!',
    status: 500,
  });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', VariablesRoutes);

// Default route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to E-commerce Rest APIs</h1>
    Contact me <a href="https://codersgyan.com/links/">here</a><br>
    Or reach out for API help: codersgyan@gmail.com
  `);
});

app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connect("mongodb+srv://basudevnayak31:OPOgFhSnU8pb1x2x@cluster0.exfu446.mongodb.net/investationTeam?retryWrites=true&w=majority&appName=Cluster0");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
};

startServer();
