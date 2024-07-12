import exppress from "express"
import driverController from "../controllers/driverController"

const router = exppress.Router()

const { registerPassenger, getMe, getVoices, sendVoice } = driverController

router.post("/register-passenger", registerPassenger)
router.post("/get-me", getMe) //
router.post("/get-voices", getVoices) //
router.post("/send-voice", sendVoice)

export default router
