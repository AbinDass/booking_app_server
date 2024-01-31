import Express  from "express";
import { bookSeat } from "../controller/bus/busController.js";


const router = Express.Router()
router.post(`/bookbus`, bookSeat)
export default  router;