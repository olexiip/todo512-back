import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
import Token from "../models/token.js"

class TokenService {
    constructor(logger) {
        this.log = logger;
    }
    generateToken(payload){
        this.log.info(`tokenService > generateToken`);
        const accesToken = jwt.sign(payload, process.env.JWT_S, {expiresIn: "1m"});
        const refreshToken = jwt.sign(payload, process.env.JWT_R_S, {expiresIn: "15d"});
        return {accesToken, refreshToken};
    }
    async saveToken(userId, refreshToken) {
        this.log.info(`tokenService > saveToken`);
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) {
            this.log.info(`tokenService > try save(1)`);
            await this.delTokenbyID(userId);
            //tokenData.refreshToken=refreshToken;
            this.log.info(`tokenService > try save(1.1)`);
            //return tokenData.save();
        }
        this.log.info(`tokenService > try save(2)`);

        let  token ; 
        try {
            token = await Token.create({user: userId, refreshToken});
        } catch (e) {
            console.log("error saving token")
            console.log(e);
        }
        return token;
    }
    async delToken(refreshToken) {
        this.log.info(`tokenService > delToken`);
        const isDelToken = await Token.deleteOne({refreshToken});
    }
    async delTokenbyID(id) {
        this.log.info(`tokenService > delTokenbyID`);
        const isDelToken = await Token.deleteMany({user: id});
        return isDelToken;
    }
    async checkAccesToken(accesToken) {
        //this.log.info(`tokenService > checkAccesToken`);
        try {
            const isOkToken = await jwt.verify(accesToken, process.env.JWT_S);
        return isOkToken;
        } catch (e) {
            this.log.info(`tokenService > bad AccesToken`);
            return null;
        }
    }
    async checkRefreshToken(refreshToken) {
        this.log.info(`tokenService > checkRefreshToken`);
        try {
            const isOkToken = await jwt.verify(refreshToken, process.env.JWT_R_S);
            return isOkToken;
        } catch (e) {
            return null;
        }
    }


    

}
const tokenService = new TokenService(logger);
export default tokenService;