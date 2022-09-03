import express from "express";
import todoController from "../controllers/controller.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import authController from "../controllers/authController.js"

const routerF = express.Router();
routerF.get("/getAll", authMiddlewares, async (req, res, next) => todoController.getAll(req, res).catch(next));
routerF.post("/addItem", authMiddlewares, async (req, res, next) => todoController.createItem(req, res).catch(next));
routerF.delete("/delItem", authMiddlewares, async (req, res, next) => todoController.deleteItem(req, res).catch(next));
routerF.post("/update", authMiddlewares, async (req, res, next) => todoController.update(req, res).catch(next));
routerF.post("/share", authMiddlewares, async (req, res, next) => todoController.share(req, res).catch(next));
routerF.post("/isComplited", authMiddlewares, async (req, res, next) => todoController.updateStatus(req, res).catch(next));
routerF.post("/findUser", authMiddlewares, async (req, res, next) => authController.findUser(req, res).catch(next));
routerF.post("/findTodo", authMiddlewares, async (req, res, next) => todoController.findTodo(req, res).catch(next));
routerF.get("/sharedWith", authMiddlewares, async (req, res, next) => todoController.sharedWith(req, res).catch(next));

export default routerF;