import cookieParser from "cookie-parser"
import connectDB from "../DB/connection.js";
import { glopalErrHandling } from "./utils/errorHandling.js";
import postrRouter from './modules/Posts/posts.router.js'
import authRouter from './modules/Auth/auth.router.js'
import adminRouter from './modules/Admin/admin.router.js'

const initApp = (app, express) => {


  app.use(express.json({}));
  app.use(cookieParser()) 

  app.use("/auth",authRouter)
  app.use("/admin",adminRouter)
  app.use("/post",postrRouter)
  app.all("*", (req, res, next) => {
    return res.status(404).json({ message: "error 404 in-valid routing" });
  });

  app.use(glopalErrHandling);

  //connect DataBase
  connectDB();
};

export default initApp;
