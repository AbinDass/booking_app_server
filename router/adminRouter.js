import Express  from "express";
import { addBus, addDriver } from "../controller/bus/busController.js";


const router = Express.Router()
// bus routes are here
router.post(`/addbus`, addBus)
router.post(`/adddriver`, addDriver)

export default  router;