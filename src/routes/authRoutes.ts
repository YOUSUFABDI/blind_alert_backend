import express from "express"
import authController from "../controllers/authController"

const router = express.Router()

const { registerDriver, verifyOtpCode, loginDriver, getMe } = authController

router.post("/register", registerDriver)
router.post("/verify-otp", verifyOtpCode)
router.post("/login", loginDriver)
router.get("/get-me", getMe)

export default router
