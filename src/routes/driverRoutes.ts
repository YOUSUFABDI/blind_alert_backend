import exppress from "express"
import driverController from "../controllers/driverController"

const router = exppress.Router()

const { registerPassenger } = driverController

router.post("/register-passenger", registerPassenger)

export default router
