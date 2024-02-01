import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    busNumber: String,
    busType: String,
    busTotalSeats: Number,
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
            seatNumber: {
                type: Number,
                required: true,
                min: 1,
                max: 54,
            },
            is_booked: {
                type: Boolean,
                default: false,
            },
            bookedDate:Date
        },
    ]
},{
    timestamps:true
});

const busticket = mongoose.model("Bus", busSchema);
export default busticket;
