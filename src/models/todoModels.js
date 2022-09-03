import { v4 as uuidv4 } from 'uuid';
//import Todo from './todo';

class TodoModel {
    constructor() {
        this.data = new Map();
    }
    create(title) {
        const id = uuidv4();
        const date = Date.now();
        this.data.set(id, {id, title, owner: "userName", sharedWith: null, isComplited: false, createdAt: date, updatedAt: date});
        return this.data.get(id);
    }
    getall(req, res) {
        return [...this.data.values()];
    }
    getById(id) {
        return this.data.get(id);
    }
    delete(id) {
        console.log("delete id:")
        console.log(id)
        return this.data.delete(id.id);
    }
    update(id, todo) {
        let hasChange=false;
        console.log("update:");
        console.log(id);
        console.log(todo);
        console.log(todo.title);
        const item = this.data.get(id);
        //const nonupdatebleParams = ["createdAt", "id", "updatedAt", "owner"];
        const updatebleParams = ["title", "isComplited", "sharedWith"]; 
        for (const element in item) {
            console.log("element-----------");
            console.log(element);  
            console.log(!!todo[element]);  
            console.log(todo[element]);

            if (updatebleParams.includes(element) && todo[element]!=undefined) {
                console.log(`${element}>>>>${todo[element]}`);
                hasChange=true;
                item[element] = todo[element];
            };   
        };
        if (hasChange) item.updatedAt=Date.now();
        //
        return hasChange;
    }
}
const todoModel = new TodoModel;
export default todoModel;