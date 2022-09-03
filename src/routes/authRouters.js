import express from "express";
import authController from "../controllers/authController.js"
import check from "express-validator"
import authMiddlewares from "../middlewares/authMiddlewares.js";

const authRouters = express.Router();
authRouters.post("/login", (req, res) => authController.login(req, res));
authRouters.post("/logout", authMiddlewares, (req, res) => authController.logout(req, res));
authRouters.post("/reg", [
    check.check("email", "msg bad email").notEmpty(),
    check.check("userPass", "msg bad userPass").isLength({min:4, max:16})],
     (res, req) => authController.reg(res, req))
authRouters.get("/users", authMiddlewares, (req, res, next) => authController.users(req, res).catch(next))
authRouters.post("/check", authMiddlewares, (req, res, next) => authController.check(req, res).catch(next))
authRouters.post("/refresh", (req, res) => authController.refresh(req, res))
authRouters.get("/activate/:link", (req, res) => authController.activate(req, res))


export default authRouters;
