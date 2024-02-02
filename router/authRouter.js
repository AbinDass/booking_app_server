import Express  from "express";

import { forgotPassword, register, signIn } from "../controller/user/authController.js";

const router = Express.Router()
router.post(`/register`,register)
router.post(`/login`,signIn)
router.post(`/forgotpassword`, forgotPassword)
export default  router;