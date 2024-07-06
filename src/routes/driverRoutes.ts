import exppress from "express"
import driverController from "../controllers/driverController"

const router = exppress.Router()

const { registerPassenger, getMe, getVoices, sendVoice } = driverController

router.post("/register-passenger", registerPassenger)
router.get("/get-me", getMe)
router.get("/get-voices", getVoices)
router.post("/send-voice", sendVoice)

export default router
