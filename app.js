import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import os from 'os';

let networkInterfaces = os.networkInterfaces();

dotenv.config();
console.log(networkInterfaces);

const app = express();

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log('Server Running in PORT', PORT);
});
