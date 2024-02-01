
export const updateBookingStatus = async () => {
    try {
        // Find buses that need their booking status updated
        const busesToUpdate = await Bus.find({
            "seat_number.is_booked": true,
            "seat_number.bookedDate": { $lte: new Date() },
        });

        // Update booking status for each bus
        for (const bus of busesToUpdate) {
            for (const seat of bus.seat_number) {
                if (seat.is_booked && seat.bookedDate <= new Date()) {
                    // Reset booking status if bookedDate has passed
                    seat.is_booked = false;
                    seat.bookedDate = null; // Optional: Clear the booked date
                }
            }

            // Save the updated bus document
            await bus.save();
        }

        console.log("Booking statuses updated successfully");
    } catch (error) {
        console.error("Error updating booking statuses:", error);
    }
};
