import jwt from "jsonwebtoken";

export const verifyJwt = (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        if (!token) {
            console.log(`unauthorized`);
        } else {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decode;
            next();
        }
    } catch (error) {
        return console.log(error);
    }
};

