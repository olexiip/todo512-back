import adminTodoService from "../services/AdminTodoService.js";
import { logger } from "../utils/logger.js";


class AdminTodoController {
  constructor(service, logger) {
    this.service = service;
    this.log = logger;
    }


  async getAll(req, res) { 
    this.log.info("adminTodoController > get all todo request");
    const limit = +req?.query?.limit;
    const page = +req?.query?.page;
    if (limit && page) {
      //console.log(`>>>> get limit ${limit}, page ${page}`)
      this.log.info("adminTodoController > prep ok, call adminTodoService.getAllTodo");
      const todos = await adminTodoService.getAllTodo(limit, page);
      res.json(todos);
      return [];
    }
    this.log.info("adminTodoController > bad resp, end");
    res.json({"res" : "errr"});
    return [];
  }

  async createItem(req, res) {  
    this.log.info("adminTodoController > createItem todo request");     
    const text = req?.body?.title;
    const owner = req?.body?.owner;
    if (text && owner) {
      this.log.info("adminTodoController > prep ok, call adminTodoService.createTodo");
      const newItem = await adminTodoService.createTodo(text, owner);
      if (newItem) {
        this.log.info("adminTodoController > res ok, item created");
        res.json({"res": "item created"}); 
        return []
      }
      res.json({"res": "err"});
      return []
    }
    res.json({"res":"bad req"});
    return []
  }

  async deleteItem(req, res) {
    this.log.info("adminTodoController > deleteItem request");
    const ItemID = req.body.id;
    if (ItemID) {
      this.log.info("adminTodoController > prep ok, call adminTodoService.deleteItem");
      await adminTodoService.deleteItem(ItemID);
      res.json({"res":"ok"})
      return []
    }
    res.status(401).json({"res":"bad"});
    return []
  }

  async update(req, res) {
    this.log.info("adminTodoController > update todo request");
    const ItemID = req.body.id;
    const todo = req.body;
    if (ItemID && todo?.text) {
      this.log.info("adminTodoController > update todo > call adminTodoService.update");
      const update = await adminTodoService.update(ItemID, todo);
      res.json({res: update});
      return []
    }
    res.json({res: "errr"});
    return []
  }
  
  async updateStatus(req, res) {
    this.log.info("adminTodoController > updateStatus todo request");
    const todo = req.body;
    this.log.info(`todoID: ${todo.id} isComplited: ${todo.isComplited}`);
    //console.log(req.body);
    const result =  await adminTodoService.updateStatus(todo);
    this.log.info(result);
    console.log(result)
    if (result === "ok") {
      res.json({res: "ok"});
      return []
    }
    res.json({res: "err"});
    return []
  }

  async share(req, res) {
    this.log.info("adminTodoController > share todo request");
    const itemID = req?.body?.id;
    const recepient = req?.body?.recepient;
    this.log.info(`adminTodoController > share itemID ${itemID}`);
    this.log.info(`adminTodoController > share recepient ${recepient}`);
    if (itemID && recepient) {
      res.json({updated: await adminTodoService.ShareItem(itemID, recepient)});
      return []
    }
    res.json({res: "err"});
    return []
  }


  async findUser(req, res) {
    this.log.info("adminTodoController > findUser request");
    res.json({searchRes: await adminTodoService.findUser(req, res)});
    return []
  }
  async addUser(req, res) {
    this.log.info("adminTodoController > addUser");
    const result = await adminTodoService.addUser(req, res);
    res.json(result);
    return [];
  }
  async users(req, res) {
    this.log.info("adminTodoController > users");
    const limit = +req?.body?.limit;
    const page = +req?.body?.page;
    const result = await adminTodoService.users(limit, page);
    res.json(result);
    return [];
  }
  async delUser(req, res) {
    this.log.info("adminTodoController > delUser");
    const result = await adminTodoService.delUserbyID(req, res);
    res.json(result);
    return [];
  }
  async editUser(req, res) {
    this.log.info("adminTodoController > editUser");
    const result = await adminTodoService.editUser(req, res);
    res.json(result);
    return [];
  }
  async GetUserTodos(req, res) {
    this.log.info("adminTodoController > GetUserTodos");
    const result = await adminTodoService.GetUserTodos(req, res);
    res.json(result);
    return [];
  }
  async getUserByID(req, res) {
    this.log.info("adminTodoController > getUserByID");
    const result = await adminTodoService.getUserByID(req, res);
    res.json(result);
    return [];
  }
}
 
const adminTodoController = new AdminTodoController(adminTodoService, logger);
export default adminTodoController;

 

