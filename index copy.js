import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import dotenv from "dotenv";




dotenv.config();

const app = express();
mongoose.connect

app.use(cors(
  {
    origin: "https://hotel-backend-xi.vercel.app",
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
  }
));
app.use(express.json({ limit: "25mb" }));


app.get('/', (req, res) => {
  res.send("hello hotel")
  console.log("Hello hotel")
})

const startServer = () => {
  try {

    app.listen(5000, () => {
      console.log("Server listening on 5000 http://localhost:5000");
    });
  } catch (err) {
    console.log(err)
  }
}

startServer();