import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import apiRoutes from "./src/routes/index.js"
import adminRouter from "./src/routes/adminRouterImport.js" 
import authRouters from "./src/routes/authRouters.js";
import dotenv from "dotenv";
import errorHandler from "./src/middlewares/errorMiddlewares.js"
import mongoose from "mongoose"
import cookieParser from "cookie-parser";


dotenv.config();
const router = express.Router();

const app = express();
const __dirname = path.resolve();
console.log("HW!");
const PORT = process.env.PORT?? 3001;
const DB_CON = process.env.DB_CON;
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use("/v1/api", apiRoutes);
app.use("/auth", authRouters);
app.use("/v1/api/admin", adminRouter);

app.use(errorHandler);

app.get("/", (req, res)=>{
    res.sendFile(path.resolve(__dirname, "static", "index.html"));
});

app.listen(PORT, async ()=> {
    
    console.log(`Server started with port ${PORT}...`);
    try {
        await mongoose.connect(DB_CON);
        console.log("DB ok")
    } catch (e) {
        console.log(e);
    }


});
