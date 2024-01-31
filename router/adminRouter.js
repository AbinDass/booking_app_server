import Express  from "express";
import { addBus } from "../controller/bus/busController.js";


const router = Express.Router()
router.post(`/addbus`, addBus)
export default  router;