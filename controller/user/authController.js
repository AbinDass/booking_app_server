import { createToken } from "../../config/jwtToken.js";
import userDb from "../../model/user/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenDb from "../../model/user/tokenSchema.js";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
    console.log(req.body);
    const { name, sex, age, phone, email, password } = req.body;
    try {
        const userExist = await userDb.findOne({ email: email });

        if (!userExist) {
            console.log(userExist, `12`);
            const hashedpassword = await bcrypt.hash(password, 10);
            console.log(hashedpassword, 55555);
            console.log(password);
            const newUser = await new userDb({
                name,
                sex,
                age,
                phone,
                email,
                password: hashedpassword,
            }).save();
            const token = createToken(newUser._id);
            const userData = {
                name: newUser.name,
                sex: newUser.sex,
                age: newUser.age,
                phone: newUser.phone,
                email: newUser.email,
                token: token,
            };
            res.status(200).json(userData);
        } else {
            res.status(200).json({ message: "user already exist" });
        }
    } catch (error) {
        console.log(error);
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExist = await userDb.findOne({ email: email });
        if (userExist) {
            const passwordCheck = await bcrypt.compare(password, userExist.password);
            if (passwordCheck) {
                const token = createToken(userExist._id);

                let userData = {
                    name: userExist.name,
                    sex: userExist.sex,
                    age: userExist.age,
                    phone: userExist.phone,
                    email: userExist.email,
                    token: token,
                };
                // const token = createToken(userExist._id);
                res.status(200).json(userData);
            } else {
                res.status(200).json({ message: `password missmatch` });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        let token;
        const user = await userDb.findOne({ email: email });
        if (!user) {
            res.status(200).json({ success: false, message: `this user is not exist` });
        } else {
            const payload = {
                email: user.email,
            };
            const expiresTime = 300;

            token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: expiresTime });
            const newToken = await new tokenDb({ userId: user._id, token });

            //creating mailtransporter

            const mailtransporter = nodemailer.createTransport({
                email: "gmail",
                auth: {
                    user: "abindas350@gmail.com",
                    pass: "", //password means login to myaccount.google and goto app password use the key pass here
                },
            });

            let mailDetails = {
                from : "abindas350@gmail.com",
                to:email,
                subject:`reset password`,
                html:`
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>reset password</title>
                </head>
                <body>
                    <h1>password reset request</h1> 
                    
                    <p>dear ${user.name} ,</p>
                    <a href="${process.env.LIVE_URL}/reset/${token}"><button>reset password</button></a>
                    <p>please note this link is only valid for 5 minute</p>
                    <p>thank you</p>
                    <p>from abindas</p>
                </body>
                </html>
                `
            }
            
            mailtransporter.sendMail(mailDetails, async (err, data)=>{
                if(err){
                    console.log(err)
                    return res.status(200).json({message:`something went wrong`})
                }
            })

            // let verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
            // if (verify) {
            //     return res.status(200).json({ token: token, message: "verified" });
            // }
        }
    } catch (error) {
        res.status(200).json({ success: false, message: error.message });
    }
};
