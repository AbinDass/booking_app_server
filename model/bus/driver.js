import mongoose from "mongoose";
const busDriverSchema = new mongoose.Schema({
    driverName:String,
    driverPhone:String,
})


const busDriver = mongoose.model("Driver", busDriverSchema);
export default busDriver;