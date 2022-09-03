import User from "../models/users.js";
import Role from "../models/roles.js";
import Token from "../models/token.js"
import Todo from "../models/todo.js"
import {logger} from "../utils/logger.js"

class TodoService {
    async createTodo(req, res) {
        console.log("req.user:");
        console.log(req.user);
        const newItem = new Todo({
            owner:req.user.id, 
            text: req.body.text, 
            });
            newItem.save();
        console.log(newItem);
        
        return  newItem;
    }

    async getAllTodo(req, res) {
        console.log(req.user.id)
        console.log(req.body)
        console.log(req.query)
        const limit = +req.query.limit;
        const page = +req.query.page;
        const respp = await Todo.find({owner : req.user.id});
        const respp2 = await Todo.find({sharedWith : {$in: req.user.id}});
        const allItems = [...respp, ...respp2];
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
        console.log(result);
        return  result;
    }

  //  async getById(id) {
   //     logger.info(`service got req with id=${id}`);
   //     return todoRepository.getById(id);
    //}

    async update(req, res) {
        const userID = req.user.id;
        console.log(`userID ${userID}`)
        const ItemID = req.body.id;
        const todo = req.body;
        console.log(`ItemID ${ItemID}`)
        console.log(`todo ${todo}`)
        console.log(todo)
        const item = await Todo.findById(ItemID);
        if (!(item.owner===userID)) {
            return {res: "error norm"};
        }
        item.text=todo.text;
        item.save();
        return {res: "text updated"};
    }

    async updateStatus(req, res) {
        logger.info(`service got updateStatus req `);
        const userID = req.user.id;
        const ItemID = req.body.id;
        const todo = req.body;
        const item = await Todo.findById(ItemID);
        const isShred = item.sharedWith.indexOf(userID);
        if ((item.owner===userID) || (isShred>=0)) {
            item.isComplited=todo.isComplited;
            item.save();
            return {res: "status updated"};
        }
        return {res: "error norm"};
    }

    async deleteItem(req, res) {
        const userID = req.user.id;
        const ItemID = req.body.id;
        logger.info(`service got item DELETE req `);
        const item = await Todo.findById(ItemID);
        if (item?._id) {                        // item exist
            console.log(`item : ${item}`);
                if (item.owner === userID) {    // user is ownwer -> delete
                    const delIsOK = await item.delete();
                    return {res:"item deleted"};
                } else {                       // user is subscriber -> unsub
                    const indexForDel = item.sharedWith.indexOf(userID)
                    if (indexForDel>=0) {
                        item.sharedWith.splice(indexForDel,1);
                        console.log(item.sharedWith);
                        await item.save();
                        return {res:"unsubscribed"}
                    }
                }
        }
        return {res:"errr"}
    }

    async ShareItem(req, res) {
        const userID = req.user.id;
        const itemID = req.body.id;
        const recepient = req.body.recepient;
        logger.info(`service got ShareItem req with id=${itemID}`);
        const item = await Todo.findById(itemID);
        const CheckRecepient = await User.findById(recepient);

        console.log(`item : ${item}`);
        console.log(`item.owner : ${item.owner}`);
        console.log(`userID : ${userID}`);
        console.log(`recepient : ${recepient}`);
        console.log(`CheckRecepient : ${CheckRecepient}`);

        if (CheckRecepient?._id && (item.owner === userID) && (recepient !== userID)) {
            console.log("SHARE!!")
            const Share = await item.sharedWith.push(CheckRecepient._id);
            await item.save();
            //console.log(item) 
            return {"res":"shared"};
        };
        //console.log("NOT -------------- SHARE!!")
        return {"res":"smww"};
    }
    
    async findTodo(req, res) {
        console.log(req.body)
        const userID = req.user.id;
        const q = req.body.q;
        console.log(q)
        if (q) {
            //logger.info(`service got findUser req "${reqEmail}" `);
            const searchString = q.replace(/[\\.$'"]/g, "\\$&");
            // const recepient = await User.findOne({email : reqEmail});
            //const recepient = await User.find({$text: {email: reqEmail}})
            //logger.info(`search by "${searchString}" `);
            const qTodos = await Todo.find({ text: { $regex: searchString, $options: "i" } });
    
            console.log(`userID : ${userID}`);
            console.log(`qTodos : ${qTodos}`);
            return qTodos;
        }
        logger.info(`service got BAD findUser req ${q} `);
        return [];
    }
    
    async sharedWith(id) {
        logger.info(`todoService > sharedWith > id=${id}`);
        let users;
        try {
            const todoshka = await Todo.findById(id);
            const owner = await User.findById(todoshka.owner)
            //console.log(todoshka);
            const idList = todoshka.sharedWith;
            console.log(idList);
            users = await User.find().where("_id").in(idList).exec();
            //console.log(users.length);
        return {users, todoshka, owner};
        } catch (e) {
            logger.info(e);
            return {users:[], todoshka: [], owner: []};
        }
        
    }
}

const todoService = new TodoService();
export default todoService;  