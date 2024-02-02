import mongoose, { Schema } from "mongoose";

const tokenSchema = new mongoose.Schema(
    {
        userId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        token:{
            type:String,
            required:true
        },
        created:{
            type:Date,
            default: Date.now(),
            expires: 300
        }
    }
)

const token = mongoose.model("Token", tokenSchema);
export default token;