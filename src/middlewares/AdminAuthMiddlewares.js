import tokenService from "../services/token.service.js";
import User from "../models/users.js";
import Token from "../models/token.js";
const adminAuthMiddlewares = async (req, res, next) => {
    console.log(">check admin");
    const userAuthorizationHeader = req.headers.authorization;
    
    if (!userAuthorizationHeader) {
        return res.json({"res":"auth error"});
    }
    const bearer = userAuthorizationHeader.split(" ")[1];

    let tokenIsOk;
    let currRtoken;
    let currUser;
    let isAdmin;
    try {
        tokenIsOk = await tokenService.checkAccesToken(bearer);
        currRtoken = await Token.find({user: tokenIsOk.id});
        currUser = await User.findById(tokenIsOk.id);
        isAdmin = currUser.roles.indexOf("ADMIN")>-1;
    } catch (e) {
        console.log("bad admin check");
        return res.json({"res":"auth error2"});
    }

    if(!isAdmin) {
        console.log(`user ${tokenIsOk.id} tryes hack admin`)
        const trashToken = await Token.findByIdAndDelete(currRtoken[0].id);
        await trashToken.delete();
        return res.status(401).json({"res":"auth error2"});
    }
    //console.log("authMiddlewares OK");
    req.user=tokenIsOk;
    next();
};
export default adminAuthMiddlewares;