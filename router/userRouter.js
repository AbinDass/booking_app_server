import Express  from "express";
import { bookSeat, cancelticket } from "../controller/bus/busController.js";


const router = Express.Router()
router.post(`/bookbus`, bookSeat)
router.post(`/cancelticket`, cancelticket)

export default  router;