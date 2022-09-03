import mongoose from "mongoose";
const { Schema, model } = mongoose;

const RoleSchema = new Schema({
    value: {type: String, unique: true, required: true, default: "USER" }
});
 const Role = model("Role", RoleSchema);
 export default Role;