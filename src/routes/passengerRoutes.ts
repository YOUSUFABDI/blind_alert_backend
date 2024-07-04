import exppress from "express"
import passengerController from "../controllers/passengerController"

const router = exppress.Router()

const { loginPassenger, getMe } = passengerController

router.post("/login", loginPassenger)
router.get("/get-me", getMe)

export default router
