import path from 'path'
import {fileURLToPath} from 'url'
import dotenv from "dotenv";

//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "./config/.env") });
import express from "express";
import initApp from './src/app.router.js'


const app = express();
const   port = process.env.PORT;

// app.set('case sensitive routing',true) //make url routing in case sensitive 

initApp(app, express);


app.listen(port , () => {
  console.log(`Server is running on port.......${port}`);
});
