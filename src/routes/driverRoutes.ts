import exppress from "express"
import driverController from "../controllers/driverController"

const router = exppress.Router()

const { registerPassenger, getMe } = driverController

router.post("/register-passenger", registerPassenger)
router.get("/get-me", getMe)

export default router
