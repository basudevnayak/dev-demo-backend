import express from 'express';
import { PORT, DB_URL } from './src/config/index.js';
// import authRoutes from "./routes/authRoutes.js"
import {
  authRoutes, VariablesRoutes, Designations, QualificationTypesRoutes,
  SkillTypesRoutes, LeaveTypesRoutes, AwardTypesRoutes,
  WarningTypesRoutes,
  TerminationTypesRoutes, DocumentsTypesRoutes,
  BusinessNatureTypesRoutes, ExpenseTypesRoutes,
  ArrangementTypesRoutes, CountriesRoutes, StatesRoutes, 
  // QrCodeRoutes
} from './src/routes/index.js';
import { connect } from './src/config/connect.js';
import dotenv from 'dotenv';
import CustomErrorHandler from './src/utils/CustomErrorHandler.js';
dotenv.config();
import errorHandler from './src/middlewares/errorHandler.js';
const app = express();
// import routes from './routes';
// import mongoose from 'mongoose';
// import path from 'path';
import cors from 'cors';
import { DATABASE_URL } from './src/config/index.js';
import auth from './src/middlewares/auth.js';
import admin from './src/middlewares/admin.js';
import QRCode from 'qrcode';
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
// app.use('/api',[auth], VariablesRoutes);
app.use('/api', VariablesRoutes);
app.use('/api', Designations);
app.use('/api', QualificationTypesRoutes);
app.use('/api', SkillTypesRoutes);
app.use('/api', LeaveTypesRoutes);
app.use('/api', AwardTypesRoutes);
app.use('/api', WarningTypesRoutes);
app.use('/api', TerminationTypesRoutes);
app.use('/api', DocumentsTypesRoutes);
app.use('/api', BusinessNatureTypesRoutes);
app.use('/api', ExpenseTypesRoutes);
app.use('/api', ArrangementTypesRoutes);

app.use('/api', CountriesRoutes);
// app.use('/api', StatesRoutes);
// app.use('/api', QrCodeRoutes)
app.get('/qrcode/:phone', async (req, res) => {
  const { phone } = req.params;;
  console.log(req.params)
  if (!phone) {
    return res.status(400).send('Phone number is required');
  }

  const telUrl = `tel:${phone}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(telUrl);
    res.send(`
      <h2>Scan to Call: ${phone}</h2>
      <img src="${qrDataUrl}" alt="QR Code" />
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to generate QR Code');
  }
});
app.get('/qrcode/api/:phone', async (req, res) => {
  const { phone } = req.params;;
  console.log(req.params)
  if (!phone) {
    return res.status(400).send('Phone number is required');
  }

  const telUrl = `tel:${phone}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(telUrl);
    return res.status(201).json({
      message: 'Created successfully',
      status: 201,
      data: qrDataUrl,
  });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to generate QR Code');
  }
});









// app.use('/uploads', express.static('uploads'));
app.use('/', (req, res) => {
  res.send(`
  <h1>Welcome to E-commerce Rest APIs</h1>
  You may contact me <a href="https://basudevNayak.com/links/">here</a>
  Or You may reach out to me for any question related to this Apis: basudevNayak@gmail.com
  `);
});

app.use(errorHandler);
// const PORT = process.env.PORT || PORT;
// app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

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