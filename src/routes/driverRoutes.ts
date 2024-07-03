import express from "express"
import driverController from "../controllers/driverController"

const router = express.Router()

const { registerDriver, loginDriver } = driverController

router.post("/register", registerDriver)
router.post("/login", loginDriver)

export default router
