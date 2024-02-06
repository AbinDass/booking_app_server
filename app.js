import express from 'express';
import dotenv from 'dotenv';
import { bookingDB } from './config/dbConnection.js';
import authRoutes from './router/authRouter.js'
import userRoutes from './router/userRouter.js'
import adminRoutes from './router/adminRouter.js'

const app = express()
dotenv.config({path:'./env'})
app.use(express.json({ limit: "2MB" }));
app.use(express.urlencoded({ extended: true }));

bookingDB.then(()=>{
    console.log(`booking db connected succesfully`)
}).catch((err) => console.log(err))

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/admin', adminRoutes)  
app.listen(process.env.PORT, () => {
    console.log(`booking server is running on ${process.env.PORT}`) 
})