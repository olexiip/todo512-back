import mongoose from "mongoose";
const { Schema, model } = mongoose;

const TodoSchema = new Schema({
    owner: {type: String, required: true, ref: "User"},
    sharedWith: [{type: String, required: true, ref: "User", default: ""}],
    text: {type:String, required:true},
    isComplited: {type:Boolean, required:true, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},
//
);
 const Todo = model("Todo", TodoSchema);
 export default Todo;
//export default User;