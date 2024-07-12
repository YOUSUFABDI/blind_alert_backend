import exppress from "express"
import passengerController from "../controllers/passengerController"

const router = exppress.Router()

const { loginPassenger, getMe, getLastVoice } = passengerController

router.post("/login", loginPassenger)
router.post("/get-me", getMe)
router.post("/get-last-voice", getLastVoice)

export default router
