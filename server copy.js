import express from 'express';
import { PORT, DB_URL } from './config/index.js';
// import authRoutes from "./routes/authRoutes.js"
import { authRoutes,VariablesRoutes } from './routes/index.js';
import { connect } from './config/connect.js';
import dotenv from 'dotenv';
import CustomErrorHandler from './utils/CustomErrorHandler.js';
dotenv.config();
import errorHandler from './middlewares/errorHandler.js';
const app = express();
// import routes from './routes';
// import mongoose from 'mongoose';
// import path from 'path';
import cors from 'cors';
import { DATABASE_URL } from './config/index.js';

// Database connection
// mongoose.connect(DB_URL, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     useFindAndModify: false,
  // });
  // const db = mongoose.connection;
  // db.on('error', console.error.bind(console, 'connection error:'));
  // db.once('open', () => {
    //     console.log('DB connected...');
    // });
    
    // global.appRoot = path.resolve(__dirname);
    app.use(cors());
    app.use((err, req, res, next) => {
  if (err instanceof CustomErrorHandler) {
      // If it's a CustomErrorHandler, respond with the status and message in JSON format
      return res.status(err.status).json({
          message: err.message,
          status: err.status,
      });
  }

  // For other errors (general error handling)
  return res.status(500).json({
      message: 'Something went wrong!',
      status: 500,
  });
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', VariablesRoutes);
// app.use('/uploads', express.static('uploads'));
app.use('/', (req, res) => {
    res.send(`
  <h1>Welcome to E-commerce Rest APIs</h1>
  You may contact me <a href="https://codersgyan.com/links/">here</a>
  Or You may reach out to me for any question related to this Apis: codersgyan@gmail.com
  `);
});

app.use(errorHandler);
// const PORT = process.env.PORT || PORT;
// app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

const start = async () => {
  console.log(DATABASE_URL)
  try {
    // await connect("mongodb+srv://basudevnayak31:OPOgFhSnU8pb1x2x@cluster0.exfu446.mongodb.net/investationTeam?retryWrites=true&w=majority&appName=Cluster0");
    await connect(DATABASE_URL);
    
    // Uncomment this and comment below one if you want to run on ip address so that you can
    // access api in physical device

    app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
    // server.listen(process.env.PORT || 3000, () =>
      console.log(
        `HTTP server is running on port http://localhost:${
          process.env.PORT || 3000
        }`
      )
    );
  } catch (error) {
    console.log(error);
  }
};

start();