import express from "express";
import apiAdminRoutes from "./AdminRouter.js"

const adminRouter = express.Router();
adminRouter.use(apiAdminRoutes);


export default adminRouter;