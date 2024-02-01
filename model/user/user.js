import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    sex: String,
    age: Number,
    phone: { type: String, unique: true, min: 10 },
    email: { type: String, unique: true },
    password:String,
    busBookings:[{
        busTicket:{
            type:mongoose.Types.ObjectId,
            ref:'Bus'
        },
        seatNumber:Number,
        date:String,
        status:Boolean,
    }]
});

const user = mongoose.model("User", userSchema);

export default user;
