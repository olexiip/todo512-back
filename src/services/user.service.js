import User from "../models/users.js";
import Role from "../models/roles.js";
import Token from "../models/token.js"
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../utils/logger.js";
import { validationResult } from "express-validator";
import tokenService from "../services/token.service.js"
import UserDTO from "../dto/userDto.js";
import mailService from "../services/mail.service.js"

class UserService {
    constructor(logger) {
        this.log = logger;
      }
async register(req, res) {
    this.log.info(`>>> reg service request`);
    //if (validationResult.errors) {
    //    return  res.status(400).json({"res": "bad reg data"});
   // }
   //console.log(req.body);
    const candidate = await User.findOne({email: req.body.userEmail});
    if (candidate) {
        //throw new error.status("bad reg login") ;
        this.log.info(`>>> reg service: email already in use`);
        return ({"res": "email already in use"});
    };
    const hashedPass = bcrypt.hashSync(req.body.userPass, 7); 
    const newUserRole = await Role.findOne({value: "USER"});
    const actLink = uuidv4();
    const newUser = new User({
        email:req.body.userEmail, 
        password: hashedPass, 
        actLink, 
        roles:newUserRole.value,
        userName: req.body.userName,
        userSurname: req.body.userSurname,
        dob: req.body.userDateOfBirth,
        });
    const userDto = new UserDTO(newUser);
    newUser.save();
    this.log.info(`user sercice> user created`);
    await mailService.sendActMail(req.body.userEmail, `${process.env.URL}/auth/activate/${actLink}`);
    this.log.info(`>>> mail sended`);
    //const tokens = tokenService.generateToken({...userDto});
    //await tokenService.saveToken(userDto.id, tokens.refreshToken);
    newUser.save();
    
    //return {...tokens,user: userDto};
    return {user: userDto};
    //this.log.info(`>>> reg service done`);
    //return res.json({"res": "reg done"});
    }


async login(req, res) {
    this.log.info(`user sercice > login request`);
    //this.log.info(req.body.email);
    const loginUser = await User.findOne({email: req.body.email}).select("+password");
   
    if (!loginUser) {
        this.log.info(`user sercice > login not finded id DB`);
        return {"res": "bad login data"};
    }
    this.log.info(`user sercice > login data: login: ${req.body.email} pass: ${loginUser.password}`);
    let validPass;
    try {
        //console.log(req.body.userpass);
        validPass = await bcrypt.compareSync(req.body.userpass, loginUser.password);
        this.log.info(`user sercice > chekicng pass ok`)
    } catch (e) {
        this.log.info(`user sercice > chekicng pass error`);
        return {"res": "bad login data"};
    }
    if (!validPass) {
        this.log.info(`user sercice > login login bad bass`);
        return {"res": "bad pass"};
    }
    await tokenService.delTokenbyID(loginUser._id);
    const userDto = new UserDTO(loginUser);
    const tokens = await tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    //this.log.info(`user sercice > ${loginUser}`);
    await loginUser.save();
    this.log.info(`user sercice > login ok`);
    return {...tokens, user: userDto};      
}

async activate(actLink) {
    this.log.info(`userService>activate`);
    const currUser = await User.findOne({actLink});
    if (!currUser) {
        this.log.info(`userService > activate> act failed`);
        return "notActivated"
    }
    currUser.isActivated = true;
    await currUser.save();
    //this.log.info(`>>> user.service act done`);
    return "activated"
}   
async logout(userID) {
    this.log.info(`userService>logout`);
    const tokenIsDeleted = await tokenService.delTokenbyID(userID);
    //console.log("tokenIsDeleted");
    //console.log(tokenIsDeleted);
    return tokenIsDeleted;
}
async refresh(refreshToken) {
    this.log.info(`userService > refresh`);
    //this.log.info(`userService > refreshToken: ${refreshToken}`);
    const refreshTokenExist = await Token.findOne({refreshToken});
    const refreshTokenIsOK = await tokenService.checkRefreshToken(refreshToken);
    if (!(refreshTokenIsOK && refreshTokenExist)) {
        this.log.info(`>>> bad refresh, tokesns are bad`);
        return null;
    }
    const userData = await User.findById(refreshTokenIsOK.id);
    if (!userData?.id){
        return null;
    }
    await tokenService.delTokenbyID(userData.id);
    const userDto = new UserDTO(userData);
    const tokens = await tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    try {
        await userData.save();
    } catch (e) {
        console.log("---token service error refresh token saving ---> ");
        console.log(e);
        return null;
    }
    this.log.info(`>>> refresh login ok`);
    return {...tokens,user: userDto};      
}
async update(req, res) {
    this.log.info(`userService > refresh`);
    
    return {"updated": "ok"};      
}
async findUser(req, res) {
    console.log(req.body)
    const userID = req.user.id;
    const reqEmail = req.body.email;
    console.log(reqEmail)
    if (reqEmail) {
        //logger.info(`service got findUser req "${reqEmail}" `);
        const searchString = reqEmail.replace(/[\\.$'"]/g, "\\$&");
        // const recepient = await User.findOne({email : reqEmail});
        //const recepient = await User.find({$text: {email: reqEmail}})
        //logger.info(`search by "${searchString}" `);
        const recepient = await User.find({ email: { $regex: searchString, $options: "i" } });

        console.log(`userID : ${userID}`);
        console.log(`recepient : ${recepient}`);
        return recepient;
    }
    logger.info(`service got BAD findUser req ${reqEmail} `);
    return [];
}


}

const userService = new UserService(logger);
export default userService;