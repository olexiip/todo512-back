import express from "express";
import routers from "../routes/router.js"

const router = express.Router();
router.use(routers);



export default router;