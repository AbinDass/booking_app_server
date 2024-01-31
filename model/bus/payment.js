import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    passengerIs: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reservaionId: {
        type: mongoose.Types.ObjectId,
        ref: "Reserve",
        required: true,
    },
    paymentDate: { type: Date, default: Date.now() },
});

const payment = mongoose.model("Payment", paymentSchema);
export default payment;
