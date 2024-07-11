import exppress from "express"
import passengerController from "../controllers/passengerController"

const router = exppress.Router()

const { loginPassenger, getMe, saveFcmToken } = passengerController

router.post("/login", loginPassenger)
router.get("/get-me", getMe)
router.post("/save-fcm-token", saveFcmToken)

export default router
