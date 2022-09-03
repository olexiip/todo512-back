import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true },
    password: {type: String, required: true, select: false },
    createdAt: { type: Date, default: Date.now },
    isActivated: {type: Boolean, default: false},
    actLink: {type: String, select: false},
    roles: [{type: String, ref: "Role"}],
    userName: {type:String, required:true},
    userSurname: {type:String, required:true},
    dob: {type:String},
},
//
);
UserSchema.index({name: 'text', 'profile.something': 'text'});

 const User = model("User", UserSchema);
 export default User;
//export default User;