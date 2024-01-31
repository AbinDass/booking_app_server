import Express  from "express";

import { register, signIn } from "../controller/user/authController.js";

const router = Express.Router()
router.post(`/register`,register)
router.post(`/login`,signIn)
export default  router;