export const createSeats = (rows, columns) => {
    if (columns > 6 || columns < 4) {
        console.log(`please enter matching width of the bus`);
        return [];
    }

    const seatLines = [];

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++) {
            let seat = "";
            // Every first and second element in each row is "#"
            if (columns == 5) {
                seat = (j === 1 || j === 2) ? " 1 " : " 2 ";
            } else if (columns == 6) {
                seat = (j === 1 || j === 2 || j === 3) ? "1 " : "2 ";
            } else {
                seat = (j === 1 || j === 2) ? " 1 " : " 2 ";
            }
            seatLines.push({ seatNumber: seatLines.length + 1, is_booked: false });
        }
    }

    const totalSeats = rows * columns;

    return { seatLines, totalSeats };
};
