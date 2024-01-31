import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    busNumber: String,
    busType: String,
    busTotalSeats: String,
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
    },
    from: String,
    dropOut: [
        {
            placeName: String,
            arrivingTime: String,
        },
    ],
    destination: String,
    seat_number: [
        {
           type:Number,
            seatNumber:Number,
            min: 1,
            max: 54,
            required: true,
            is_booked: {
                type: Boolean,
                default: false,
            },
        },
    ],
},{
    timestamps:true
});

const busticket = mongoose.model("Ticket", busSchema);
export default busticket;
