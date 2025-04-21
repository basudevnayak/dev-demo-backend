import express from 'express';
import { PORT } from './config/index.js'; // assuming PORT is something like 5000
const app = express();

app.use('/', (req, res) => {
    res.send(`
        <h1>Welcome to E-commerce Rest APIs</h1>
        You may contact me <a href="https://codersgyan.com/links/">here</a>
        Or reach out for API help: codersgyan@gmail.com
    `);
});

const port = PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}.`));
