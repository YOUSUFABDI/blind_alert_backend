import exppress from "express"
import passengerController from "../controllers/passengerController"

const router = exppress.Router()

const { loginPassenger, getMe, getVoices } = passengerController

router.post("/login", loginPassenger)
router.get("/get-me", getMe)
router.get("/get-voices", getVoices)

export default router
