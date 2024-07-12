import exppress from "express"
import passengerController from "../controllers/passengerController"

const router = exppress.Router()

const { loginPassenger, getMe, saveFcmToken, getLastVoice } =
  passengerController

router.post("/login", loginPassenger)
router.post("/get-me", getMe) //
router.post("/get-last-voice", getLastVoice) //
router.post("/save-fcm-token", saveFcmToken)

export default router
