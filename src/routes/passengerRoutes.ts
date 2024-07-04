import exppress from "express"
import passengerController from "../controllers/passengerController"

const router = exppress.Router()

const { loginPassenger } = passengerController

router.post("/login", loginPassenger)

export default router
