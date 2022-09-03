import todoService from "../services/todoService.js";
import { logger } from "../utils/logger.js";


class TodoController {
  constructor(service, logger) {
    this.service = service;
    this.log = logger;
  }
  async getAll(req, res) {
    this.log.info("todoController > get all todo request");
    const todos = await todoService.getAllTodo(req, res);
    res.json(todos);
    return [];
  }

  async createItem(req, res) {
    this.log.info(">>> createItem todo request");
    const newItem = await todoService.createTodo(req, res);
    res.json(newItem);
    return []
  }
  async deleteItem(req, res) {
    const delResult = await todoService.deleteItem(req, res);
    res.json({res:delResult})
    return []
  }
  async update(req, res) {
    this.log.info(">>> update todo request");
    const id = req.body.id;
    const todo = req.body;
    res.json({updated: await todoService.update(req, res)});
    return []
  }
  async updateStatus(req, res) {
    this.log.info(">>> updateStatus todo request");
    console.log("req.body");
    console.log(req.body);
    res.json({updated: await todoService.updateStatus(req, res)});
    return []
  }
  async share(req, res) {
    this.log.info(">>> share todo request");
    res.json({updated: await todoService.ShareItem(req, res)});
    return []
  }
  async findTodo(req, res) {
    this.log.info(">>> findTodo  request");
    res.json({todoList: await todoService.findTodo(req, res)});
    return []
  }
  async sharedWith(req, res) {
    this.log.info(`todoController > sharedWith  request`);
    const id = req?.query?.id;
    if (id) {
      this.log.info(`todoController > sharedWith > id=${id}`);
      res.json(await todoService.sharedWith(id));
      return []
    }
    res.json({res: "err"});
    return []
  }

}
 
const todoController = new TodoController(todoService, logger);
export default todoController;

 

