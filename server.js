import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { PORT, DB_URL } from './src/config/index.js';
import { connect } from './src/config/connect.js';
import dotenv from 'dotenv';
import CustomErrorHandler from './src/utils/CustomErrorHandler.js';
dotenv.config();
import errorHandler from './src/middlewares/errorHandler.js';
const app = express();
import cors from 'cors';
import { DATABASE_URL } from './src/config/index.js';
import path from "path";
import authRoutes from './src/routes/authRoutes.js';
import policiesRoutes from './src/routes/policiesRoutes.js';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import auth from './src/middlewares/auth.js';
import cookieParser from 'cookie-parser';
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./src/views"));
app.use(cors());
app.use(cookieParser());
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
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandler);
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.render('Login', { title: 'Login' });
});
app.use(expressEjsLayouts);
app.set('layout', 'layouts/main');
app.get('/dashboard', [auth], (req, res) => {
  res.render('index', { title: 'Home Page' });
});
app.use('/api', authRoutes);
app.use('/api', policiesRoutes);
app.set("layout", "layout");
const start = async () => {
  console.log(DATABASE_URL)
  try {
    await connect("mongodb+srv://basudevnayak31:efQOEf9YuGWnjxOY@cluster0.jqthd9p.mongodb.net/");
    // await connect("mongodb+srv://basudevnayak31:g0Lyh58Mspa1Xgze@cluster0.antp5wv.mongodb.net/");
    // Uncomment this and comment below one if you want to run on ip address so that you can
    // access api in physical device
    app.listen(process.env.PORT || 3000, "0.0.0.0", () =>
      // server.listen(process.env.PORT || 3000, () =>
      console.log(
        `HTTP server is running on port http://localhost:${process.env.PORT || 3000
        }`
      )
    );
  } catch (error) {
    console.log(error);
  }
};
start();