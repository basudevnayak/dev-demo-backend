import express from 'express';
import serverless from 'serverless-http';

// setup...
const app = express();

// routes...
app.get('/', (req, res) => {
  res.send('Hello from Vercel!');
});

// 👇 REQUIRED EXPORT
export const handler = serverless(app);
