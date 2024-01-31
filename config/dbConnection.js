import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const DB = process.env.DB;

export const bookingDB = mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
