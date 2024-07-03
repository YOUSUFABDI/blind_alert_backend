import express from "express"
import driverController from "../controllers/driverController"

const router = express.Router()

const { registerDriver, verifyOtpCode, loginDriver } = driverController

router.post("/register", registerDriver)
router.post("/verify-otp", verifyOtpCode)
router.post("/login", loginDriver)

export default router
