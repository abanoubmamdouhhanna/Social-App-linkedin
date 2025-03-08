import path from 'path'
import {fileURLToPath} from 'url'
import dotenv from "dotenv";
import './src/utils/eventEmitter.js'
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "./config/.env") });
import express from "express";
import initApp from './src/app.router.js'
import { app, server } from './services/socket.io.js';


const   port = process.env.PORT;

// app.set('case sensitive routing',true) //make url routing in case sensitive 

initApp(app, express);


server.listen(port , () => {
  console.log(`Server is running on port.......${port}`);
});
