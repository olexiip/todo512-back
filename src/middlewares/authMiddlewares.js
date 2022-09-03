import tokenService from "../services/token.service.js";
import User from "../models/users.js";
import Token from "../models/token.js";
const authMiddlewares = async (req, res, next) => {
    console.log(">check");
    const userAuthorizationHeader = req.headers.authorization;
    //console.log("userAuthorizationHeader:");
    //console.log(userAuthorizationHeader);
    if (!userAuthorizationHeader) {
        return res.json({"res":"auth error"});
    }
    const bearer = userAuthorizationHeader.split(" ")[1];
    //console.log("bearer:");
    //console.log(bearer);
    let tokenIsOk;
    let currRtoken;
    let currUser;
    try {
        tokenIsOk = await tokenService.checkAccesToken(bearer);
        currRtoken = await Token.find({user: tokenIsOk.id});
        currUser = await User.findById(tokenIsOk.id);
    } catch (e) {
        console.log(e);
        return res.json({"res":"auth error2"});
    }

    const acces = (!!tokenIsOk && !!currRtoken.length && !!currUser);

    if (!acces) {
        return res.status(401).json({"res":"auth error2"});
    }

    //console.log(tokenIsOk);
    const checkUser = await User.findById(tokenIsOk.id);
    if (!checkUser) {
        return res.status(401).json({"res":"auth error3"});
    }

    //console.log("authMiddlewares OK");
    //console.log(tokenIsOk);
    //const userData = tokenIsOk._id;
    req.user=tokenIsOk;
    next();
};
export default authMiddlewares;