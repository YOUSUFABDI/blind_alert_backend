import express from "express"
import authController from "../controllers/authController"

const router = express.Router()

const { registerDriver, verifyOtpCode, loginDriver } = authController

router.post("/register", registerDriver)
router.post("/verify-otp", verifyOtpCode)
router.post("/login", loginDriver)

export default router
