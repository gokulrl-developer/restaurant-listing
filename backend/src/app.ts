import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from "cors"
import router from './routes/user.routes.js';
import corsOptions from './config/cors.js';


const app= express();
app.use(express.json());

app.use(cors(corsOptions));


app.use("/", router);


export default app;