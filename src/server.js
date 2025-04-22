// api/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import serverless from 'serverless-http'; // ✅ Import this
import { connect } from './src/config/connect.js';
import { authRoutes, VariablesRoutes } from './src/routes/index.js';
import errorHandler from './src/middlewares/errorHandler.js';
import CustomErrorHandler from './src/utils/CustomErrorHandler.js';
import { DATABASE_URL } from './src/config/index.js';

dotenv.config();

const app = express();

// Connect to DB immediately when file is loaded
connect(DATABASE_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

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
 app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
    // server.listen(process.env.PORT || 3000, () =>
      console.log(
        `HTTP server is running on port http://localhost:${
          process.env.PORT || 3000
        }`
      )
    );
// ✅ Export serverless handler instead of listening
export default serverless(app);
