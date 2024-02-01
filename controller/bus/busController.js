import User from "../../model/user/user.js";
import Bus from "../../model/bus/bus.js";
import Driver from "../../model/bus/driver.js";
import cron from "node-cron";
import { createSeats } from "../../helper/createBusseats.js";
import { updateBookingStatus } from "../../helper/updateSeatBooking.js";
import mongoose from "mongoose";

//Add driver
export const addDriver = async (req, res) => {
    try {
        const { driverName, driverPhone } = req.body;
        console.log(req.body);
        if (driverName && driverPhone) {
            const driverExist = await Driver.findOne({ driverPhone: driverPhone });
            if (driverExist) {
                res.status(200).json({ message: `phone number is already exist ` });
            } else {
                const driver = new Driver({
                    driverName,
                    driverPhone,
                });
                await driver.save();
                if (driver) {
                    res.status(200).json(driver);
                } else {
                    res.status(200).json({ message: `something went wrong on driver creation` });
                }
            }
        } else {
            res.status(200).json({ message: `driver name and driver phonenumber is required` });
        }
    } catch (error) {
        console.log(error);
    }
};

//Add Bus Details
export const addBus = async (req, res) => {
    try {
        const driver = req.query.driver;
        const { busNumber, busType, from, dropOut, destination, rows, columns } = req.body;
        const seatData = createSeats(rows, columns);
        let busTotalSeats;
        let seatNumbers;
        if (seatData) {
            busTotalSeats = seatData.totalSeats;
            // extracting seats
            seatNumbers = seatData.seatLines.map((seat, index) => ({
                seatNumber: index + 1, // Assuming seat numbers start from 1
                is_booked: false,
            }));
        }
        const isBus = await Bus.findOne({ busNumber: busNumber });
        if (!isBus) {
            const newBus = await new Bus({
                busNumber,
                busType,
                busTotalSeats,
                from,
                // dropOut,
                destination,
                seat_number: seatNumbers,
                driver,
            });

            await newBus.save();
            if (newBus) {
                res.status(200).json({ newBus });
            } else {
                res.status(200).json({ message: `creation failed` });
            }
        } else {
            res.status(200).json({ message: `this bus already exist in database` });
        }
    } catch (error) {
        console.log(error);
    }
};

// Function to book a seat for a user
export const bookSeat = async (req, res) => {
    let { busTicketId, userId, seatNumber, bookedDate } = req.body;
    seatNumber = parseInt(seatNumber);
    try {
        console.log(busTicketId, userId, seatNumber);
        // Check if the seat is available
        const ticket = await Bus.findById(busTicketId);
        // console.log(ticket);
        if (!ticket) {
            throw new Error("Bus ticket not found");
        }

        const seat = ticket.seat_number.find((seat) => seat.seatNumber === seatNumber);
        console.log(seat);
        if (!seat || seat.is_booked) {
            throw new Error("Seat not available for booking");
        } else {
            // Mark the seat as booked
            seat.is_booked = true;
            seat.bookedDate = new Date(bookedDate);
        }

        cron.schedule("0 2 * * *", async () => {
            await updateBookingStatus();
        });

        // Create a booking record for the user
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.busBookings.push({
            busTicket: busTicketId,
            seatNumber: seatNumber,
            date: new Date().toLocaleDateString(),
            status: true,
        });

        // Save the changes
        await Promise.all([ticket.save(), user.save()]);

        return res.status(200).json({ ticket, user, success: true, message: "Seat booked successfully" });
    } catch (error) {
        return res.status(200).json({ success: false, message: error.message });
    }
};

//cancel the ticket

export const cancelticket = async (req, res) => {
    try {
        let { busTicketId, userId, seatNumber } = req.body;
        seatNumber = parseInt(seatNumber);
        const ticket = await Bus.findById(busTicketId);
        if (ticket) {
            const seat = ticket.seat_number.find((seat) => seat.seatNumber === seatNumber);
            if (!seat || !seat.is_booked) {
                throw new Error("Seat not available or already cancelled");
            } else {
                seat.is_booked = false;
                seat.bookedDate = null;
            }
        }
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        } else {
            busTicketId = busTicketId.trim();
            let a;
            let indexToUpdate = user.busBookings.findIndex(
                (booking) => booking.busTicket == busTicketId && booking.status === true
            );
            if (indexToUpdate !== -1) {
                user.busBookings[indexToUpdate].status = false;

                Promise.all[(await ticket.save(), await user.save())];
                return res.status(200).json({ticket,user});
            } else {
                console.log("No bus booking found with status set to false.");
                return res.status(200).json({ message: `cant find Bus` });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(200).json({ succces: false, error: error.message });
    }
};

// export const cancelticket = async (req, res) => {
//     const { busTicketId, userId, seatNumber } = req.body;
//     const seatNumberInt = parseInt(seatNumber);

//     try {
//         // Check if the user exists
//         const user = await User.findById(userId);
//         if (!user) {
//             throw new Error("User not found");
//         }

//         // Check if the bus ticket exists
//         const ticket = await Bus.findById(busTicketId);
//         if (!ticket) {
//             throw new Error("Bus ticket not found");
//         }

//         // Check if the seat is booked
//         const bookedSeat = user.busBookings.find((booking) => {
//             return (
//                 booking.busTicket.toString() === busTicketId &&
//                 booking.seatNumber === seatNumberInt &&
//                 booking.status === true
//             );
//         });

//         if (!bookedSeat) {
//             throw new Error("Seat not booked for cancellation");
//         }

//         // Mark the seat as not booked
//         const seatIndex = ticket.seat_number.findIndex((seat) => seat.seatNumber === seatNumberInt);
//         if (seatIndex !== -1) {
//             ticket.seat_number[seatIndex].is_booked = false;
//             ticket.seat_number[seatIndex].bookedDate = null;
//         }

//         // Mark the booking as canceled
//         bookedSeat.status = false;

//         // Save the changes
//         await Promise.all([ticket.save(), user.save()]);

//         return res.status(200).json({
//             success: true,
//             message: "Seat cancellation successful",
//         });
//     } catch (error) {
//         return res.status(200).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
