import { logger } from "../utils/logger.js";
import User from "../models/users.js";
import Role from "../models/roles.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js"
import dotenv from "dotenv";

dotenv.config();
const genToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, process.env.JWT_S, {expiresIn: "30m"})
}

class AuthController {
    constructor(logger) {
        this.log = logger;
    }

    async login(req, res) {
        this.log.info(`>>> login request`);
        const userData = await userService.login(req, res);
        return res.json(userData);    
    }

    async reg(req, res) {
        this.log.info(`>>> reg request`);
        const userData = await userService.register(req, res);
        console.log(userData);
        if (!userData?.user) {
            return res.status(400).json({"res": "reg error"});
        }
        return res.json(userData);
    }

    async check(req, res) {
        return res.json({res:"ok"});
    }

    async users(req, res) {
        this.log.info("req.user" );
        this.log.info(req.user.id);
        
        this.log.info(`>>> users request`);
        const allUsers = await User.find();
        return res.json(allUsers);
    }
    async refresh(req, res) {
        this.log.info(`AuthController > refresh request`);
        //console.log(req.body);
        this.log.info(`AuthController > refreshToken: ${req.body.refreshToken}`);
        if (!req.body.refreshToken) {
            res.json({"res": "user does not have a token"});
        }   
        const checkRefreshToken = await userService.refresh(req.body.refreshToken);
        if (checkRefreshToken) {
            this.log.info(`AuthController > refresh ok`);
            return res.json(checkRefreshToken);
        }
        return res.status(400).json({"res": "refresh bad"});    
        
    }
    async activate(req, res) {
        this.log.info(`>>> activate request`);
        const actLink = req.params.link;
        this.log.info(`>>> actLink:`);
        console.log(actLink);
        const isActivated = await userService.activate(actLink);
        if (isActivated==="activated") {
            res.redirect(`http://${process.env.FRONT}`);
        } else if (isActivated==="notActivated") {
            res.json({"res":"bad act link"});
        }
    }
    async logout(req, res) {
        this.log.info(`>>> logout`);
        console.log(req.user.id);
        const result = await userService.logout(req.user.id);
        res.json({"res": result});
    }

    async findUser(req, res) {
        this.log.info(">>> findUser request");
        res.json({searchRes: await userService.findUser(req, res)});
        return []
    }

}

const authController = new AuthController(logger);
export default authController;