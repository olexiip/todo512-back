import User from "../models/users.js";
import Token from "../models/token.js"
import Todo from "../models/todo.js"
import bcrypt from "bcrypt";
import {logger} from "../utils/logger.js"
import UserDTO from "../dto/userDto.js";

class AdminTodoService {
    constructor(logger) {
        this.log = logger;
      }
    async createTodo(text, owner) {
        this.log.info("adminTodoService > createTodo");
        const TargetUser = await User.findOne({email:owner});
        if (TargetUser?._id) {
            this.log.info("adminTodoService > createTodo > user exist");
            const newItem = new Todo({
                owner: TargetUser._id, 
                text: text,
            });
            await newItem.save();
            this.log.info("adminTodoService > createTodo > todo created");
            return  newItem;
        }
        this.log.info("adminTodoService > createTodo > user not exist");
        return  null
    };
    

    async getAllTodo(limit, page) {
        this.log.info("adminTodoService > getAllTodo");
        const allItems = await Todo.find({});
        const a =(limit*(page+1)-20);
        const startIndex = ((a>=0)?a:0);
        const finalIndex = startIndex + +limit;
        //console.log(`>>>> indexes   ${a}, ${finalIndex}`)
        const todoList = allItems.slice(startIndex, finalIndex);
        const total = allItems.length;
        const result={
            todoList,
            total: +total, 
            page: +page, 
            limit: +limit
        } 
        this.log.info("adminTodoService > getAllTodo > ok, end");
        return  result;
    }

    async update(ItemID, todo) {
        this.log.info("adminTodoService > update");
        const item = await Todo.findById(ItemID);
        if (item && todo?.text) {
            try {
                item.text=todo.text;
                item.save();
                this.log.info("adminTodoService > update > ok");
                return {res: "ok"};
            } catch (e) {
                console.log(e);
                this.log.info("adminTodoService > update > err");
                return {res: "errr"};
            }
        }
        this.log.info("adminTodoService > update > err");
        return {res: "errr"};
    }

    async updateStatus(todo) {
        logger.info(`adminTodoService >  updateStatus`);
        //this.log.info(`todoID: ${todo.id} isComplited: ${todo.isComplited}`);
        const item = await Todo.findById(todo.id);
        item.isComplited=todo.isComplited;
        await item.save();
        logger.info(`adminTodoService >  updateStatus > ok`);
        return "ok";
    }

    async deleteItem(ItemID) {
        this.log.info("adminTodoService > deleteItem");
        const item = await Todo.findById(ItemID);
        if (item?._id) {                        // item exist
            this.log.info("adminTodoService > deleteItem > item exist");
            await item.delete();
            const itemCheck = await Todo.findById(ItemID);
            if (itemCheck===null) {
                this.log.info("adminTodoService > deleteItem > ok, end");
                return {res:"ok"};
            }
        }
        this.log.info("adminTodoService > deleteItem > ERR");
        return {res:"errr"};
    }

    async ShareItem(itemID, recepientID) {
        this.log.info("adminTodoService > ShareItem");
        //this.log.info(`adminTodoService > ShareItem > req item id=${itemID}`);
        //this.log.info(`adminTodoService > ShareItem > req recepientID : ${recepientID}`);
        const item = await Todo.findById(itemID);
        const recepient = await User.findById(recepientID);
        //this.log.info(`adminTodoService > ShareItem > item id : ${item?._id}`);
        //this.log.info(`adminTodoService > ShareItem > item.owner : ${item?.owner}`);
        //this.log.info(`adminTodoService > ShareItem > recepient : ${recepient?._id}`);
        if (recepient?._id && (recepient !== item?.owner && item?._id)) {
            this.log.info("adminTodoService > ShareItem > check ok, try share")
            await item.sharedWith.push(recepient._id);
            await item.save();
            this.log.info("adminTodoService > ShareItem > ok")
            //this.log.info(item);
            return {"res":"shared"};
        };
        this.log.info("adminTodoService > ShareItem > err")
        return {"res":"err"};
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

    async addUser(req, res) {
        console.log(req.body);
        const hashedPass = bcrypt.hashSync(req.body.password, 7); 
        const newUser = new User({
            email: req.body.email, 
            password: hashedPass, 
            userName: req.body.userName, 
            userSurname: req.body.userSurname,
            roles: ["USER"]
        });
        if (req.body.isAdmin === "true" ) {
            newUser.roles.push("ADMIN");
        }
        console.log(newUser);
        try {
            await newUser.save();
        } catch (e) {
            console.log(e)  
            return {"res":"errr"};
        }
        
        return  {"res":"user created"};
    }
    //async updateUser(req, res) {
    //    console.log(req.body)
    //    const TargetUser = await User.findById(req.body.id);
    //    TargetUser = {...TargetUser, ...req.body};
    //    await TargetUser.save();
    //    return  TargetUser;
    //}

    async users(limit, page) {
        this.log.info(`adminTodoService > getAllUsers`)
        //this.log.info(`limit:${limit} page:${page}`)
        const a =(limit*(page+1)-limit*2);
        const startIndex = ((a>=0)?a:0);
        this.log.info(`startIndex:${startIndex} limit:${limit}`)
        //const finalIndex = startIndex + +limit;
        const userList = await User.find({}).skip(startIndex).limit(limit);
        //this.log.info(`>>>> indexes   ${a}, ${finalIndex}`)
        const total = await User.count();
        const result={
            userList,
            total: +total, 
            page: +page, 
            limit: +limit
        } 
        this.log.info(`adminTodoService > getAllUsers > ok`)
        return  result;
    }
    async delUserbyID(req, res) {
        console.log(req.body.id)
        const TargetUser = await User.findById(req.body.id);
        
        const delTodos = await Todo.find({owner: TargetUser._id});
        console.log(delTodos);
        for (let i=0; i< delTodos.length; i++) {
            console.log(delTodos[i]._id);
            const todoshka = await Todo.findById(delTodos[i]._id);
            console.log(todoshka);
            await todoshka.delete();
        };
        console.log("adminTodoService > del tokens ----------------------")
        const ffdsf = await Token.deleteMany({user: TargetUser._id});
        await TargetUser.delete();
        console.log(ffdsf)
        console.log("????????????????? ----------------------")
        return  {"res":"deleted"};
    }
    async editUser(req, res) {
        console.log("adminTodoService > edit user")
        console.log(req.body)
        let editedUser; 
        let userDto;
        editedUser = await User.findById(req.body.id); 
        console.log(req.body.id)
        if ("isAdmin" in req.body) {
            console.log("adminTodoService > edit user > isAdmin")
            console.log("roles before: ");
            console.log(editedUser.roles);
            if (req.body.isAdmin === true) {
                console.log("add ADMIN")
                editedUser.roles.push("ADMIN");
            }
            if (req.body.isAdmin === false) {
                console.log("del ADMIN")
                const roleID = editedUser.roles.indexOf("ADMIN");
                console.log("del ADMIN")
                editedUser.roles.splice(roleID,1);
            }
            console.log("roles after: ");
            console.log(editedUser.roles);
        }
        if ("userName" in req.body) {
            console.log("adminTodoService > edit user > userName")
            editedUser.userName = req.body.userName;
        }
        if ("userSurname" in req.body) {
            console.log("adminTodoService > edit user > userSurname")
            editedUser.userSurname = req.body.userSurname;
        }
        if ("email" in req.body) {
            console.log("adminTodoService > edit user > email")
            editedUser.email = req.body.email;
        }
        if ("password" in req.body) {
            console.log("adminTodoService > edit user > password")
            const hashedPass = bcrypt.hashSync(req.body.password, 7); 
            editedUser.password=hashedPass;

        }
        try {
            await editedUser.save();
            const updatedUser = await User.findById(req.body.id); 
            console.log(updatedUser);
            userDto = new UserDTO(updatedUser);
        } catch (e) {
            console.log("errrrrrrrrrrr");
            console.log(e);
            return {"res": "err"};
        }
        return  {userDto};
    }
    async GetUserTodos(req, res) {
        console.log("adminTodoService > GetUserTodos")
        const targetUser = req.query.id;
        //console.log(req.body)
        console.log(targetUser)
        //console.log(req.user.id)
       ///console.log(req.body)
        console.log(req.query)
        const limit = +req.query.limit;
        const page = +req.query.page;
        const allItems = await Todo.find({owner: targetUser});
        const a =(limit*(page+1)-20);
        const startIndex = ((a>=0)?a:0);
        const finalIndex = startIndex + +limit;
        console.log(`>>>> indexes   ${a}, ${finalIndex}`)
        const todoList = allItems.slice(startIndex, finalIndex);
        console.log(todoList)
        const total = allItems.length;
        const result={
            todoList,
            total: +total, 
            page: +page, 
            limit: +limit
        } 
        //console.log(respp);
        //console.log(result);
        return  result;



    }
    
    async getUserByID(req, res) {
        console.log("adminTodoService > getUserByID")
        const targetUser = req.query.id;
        //console.log(req.body)
        console.log(targetUser)
        const respp = await User.findById(targetUser);
        return  respp;
    }
}

const adminTodoService = new AdminTodoService(logger);
export default adminTodoService;  