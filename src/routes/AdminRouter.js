import express from "express";
import adminTodoController from "../controllers/adminController.js";
import adminAuthMiddlewares from "../middlewares/AdminAuthMiddlewares.js";

const apiAdminRoutes = express.Router();
apiAdminRoutes.get("/getAll", adminAuthMiddlewares, async (req, res, next) => adminTodoController.getAll(req, res).catch(next)); // get all todo
apiAdminRoutes.post("/addItem", adminAuthMiddlewares, async (req, res, next) => adminTodoController.createItem(req, res).catch(next)); //create any todo
apiAdminRoutes.delete("/delItem", adminAuthMiddlewares, async (req, res, next) => adminTodoController.deleteItem(req, res).catch(next)); // delete any todo
apiAdminRoutes.post("/update", adminAuthMiddlewares, async (req, res, next) => adminTodoController.update(req, res).catch(next)); //edit any tofo
apiAdminRoutes.post("/share", adminAuthMiddlewares, async (req, res, next) => adminTodoController.share(req, res).catch(next)); // share any todo
apiAdminRoutes.post("/isComplited", adminAuthMiddlewares, async (req, res, next) => adminTodoController.updateStatus(req, res).catch(next)); //update status to any todo
apiAdminRoutes.post("/users", adminAuthMiddlewares, async (req, res, next) => adminTodoController.users(req, res).catch(next)); //get all users
apiAdminRoutes.post("/addUser", adminAuthMiddlewares, async (req, res, next) => adminTodoController.addUser(req, res).catch(next)); // adm create user
apiAdminRoutes.post("/delUser", adminAuthMiddlewares, async (req, res, next) => adminTodoController.delUser(req, res).catch(next)); // del any user
apiAdminRoutes.post("/editUser", adminAuthMiddlewares, async (req, res, next) => adminTodoController.editUser(req, res).catch(next)); // edit any user
apiAdminRoutes.get("/getByUser", adminAuthMiddlewares, async (req, res, next) => adminTodoController.GetUserTodos(req, res).catch(next)); // edit any user
apiAdminRoutes.get("/getByID", adminAuthMiddlewares, async (req, res, next) => adminTodoController.getUserByID(req, res).catch(next)); // edit any user







export default apiAdminRoutes;