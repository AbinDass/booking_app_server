import mongoose from "mongoose";

const reservedSchema = new mongoose.Schema(
    {
        busId: {
            type: mongoose.Types.ObjectId,
            ref: "Ticket",
            required: true,
        },
        userIs: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: Date,
    },
    {
        timestamps: true,
    }
);

const bookedDb = mongoose.model("Reserve", reservedSchema);
export default bookedDb;
