import Express  from "express";

import { forgotPassword, register, resetPassword, signIn } from "../controller/user/authController.js";

const router = Express.Router()
router.post(`/register`,register)
router.post(`/login`,signIn)
router.post(`/forgotpassword`, forgotPassword)
router.post(`/resetpassword/:id/:token`, resetPassword)
export default  router;