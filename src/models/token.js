import mongoose from "mongoose";

const { Schema, model } = mongoose;
console.log(model);
const TokenSchema = new Schema({
    user: {type: Schema.Types.ObjectId, unique: true, ref: "User" },
    refreshToken: {type: String, required: true },
});
 const Token = model("Token", TokenSchema);
 export default Token;
 //console.log(Token);
//export default User;
