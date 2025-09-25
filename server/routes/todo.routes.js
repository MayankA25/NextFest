import { Router } from "express";
import { addTodo, addToMyGoogleCalendar, changeStatus, deleteTodo, editTodo, getAllTodos, shareTodo } from "../controllers/todo.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const todoRouter = Router();


todoRouter.get("/gettodos",verifyToken, getAllTodos);
todoRouter.post("/addtodo",verifyToken, addTodo);
todoRouter.put("/edittodo",verifyToken, editTodo);
todoRouter.delete("/deletetodo",verifyToken, deleteTodo);
todoRouter.put("/changestatus",verifyToken, changeStatus)
todoRouter.post("/addtocalendar", verifyToken, addToMyGoogleCalendar);
todoRouter.post("/sharetodo", verifyToken, shareTodo);


export default todoRouter;
