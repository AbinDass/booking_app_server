import ticketDb from "../../model/bus/bus.js";
import User from "../../model/user/user.js";

export const addBus = async (req, res) => {
    try {
        const driver = req.query.driver
        const {busNumber,busType,busTotalSeats,from,dropOut,destination,seat_number} = req.body
        console.log(busNumber,busType,busTotalSeats,from,dropOut,destination,seat_number,driver)
        
        res.send({driver})
    } catch (error) {
        console.log(error)
    }

};

// Function to book a seat for a user
export const bookSeat = async (req, res) => {
    const {busTicketId, userId, seatNumber} = req.body
    try {
        console.log(`ETHI`)
        console.log(busTicketId, userId, seatNumber)
        // Check if the seat is available
        const ticket = await ticketDb.findById(busTicketId);
        console.log(ticket)
        if (!ticket) {
            throw new Error("Bus ticket not found");
        }

        const seat = ticket.seat_number.find((seat) => seat === seatNumber);
        console.log(seat)
        if (!seat || seat.is_booked) {
            throw new Error("Seat not available for booking");
        }

        // Mark the seat as booked
        seat.is_booked = true;

        // Create a booking record for the user
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.bookings.push({
            busTicket: busTicketId,
            seatNumber: seatNumber,
        });

        // Save the changes
        await Promise.all([ticket.save(), user.save()]);

        return res.status(200).json({ ticket, user, success: true, message: "Seat booked successfully" });
    } catch (error) {
        return res.status(200).json({ success: false, message: error.message });
    }
}


