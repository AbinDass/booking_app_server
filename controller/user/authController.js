import { createToken } from "../../config/jwtToken.js";
import userDb from "../../model/user/user.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    console.log(req.body);
    const { name, sex, age, phone, email, password } = req.body;
    try {
        const userExist = await userDb.findOne({ email: email });
        
        if (!userExist) {
            console.log(userExist,`12`);
            const hashedpassword = await bcrypt.hash(password, 10);
            console.log(hashedpassword, 55555)
            console.log(password);
            const newUser = await new userDb({
                name,
                sex,
                age,
                phone,
                email,
                password:hashedpassword
            }).save();
            const token = createToken(newUser._id);
            const userData = {
                name:newUser.name,
                sex:newUser.sex,
                age:newUser.age,
                phone:newUser.phone,
                email:newUser.email,
                token:token
            }
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
                    name:userExist.name,
                sex:userExist.sex,
                age:userExist.age,
                phone:userExist.phone,
                email:userExist.email,
                token:token
                }
                // const token = createToken(userExist._id);
                res.status(200).json( userData);
            } else {
                res.status(200).json({ message: `password missmatch` });
            }
        }
    } catch (error) {
        console.log(error);
    }
};
