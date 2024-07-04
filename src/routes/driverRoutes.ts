import exppress from "express"
import driverController from "../controllers/driverController"

const router = exppress.Router()

const { registerPassenger, loginPassenger } = driverController

router.post("/register-passenger", registerPassenger)
router.post("/login-passenger", loginPassenger)

export default router
