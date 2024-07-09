import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import createHttpError, { isHttpError } from "http-errors"
import authRouter from "./routes/authRoutes"
import driverRouter from "./routes/driverRoutes"
import passengerRouter from "./routes/passengerRoutes"
import dotenv from "dotenv"
import responseHandler from "./middlewares/responseMiddleware"

dotenv.config()

const app = express()

// Set limit to 4GB
app.use(express.json({ limit: "4000mb" }))
app.use(cors())
app.options("*", cors())

// response handler middleware
app.use(responseHandler)

app.get("/", (req, res) => {
  res.json({ message: "Wagwan!" })
})
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/driver", driverRouter)
app.use("/api/v1/passenger", passengerRouter)

app.use((req, res, next) => {
  next(createHttpError(404, "Enpoint not found!"))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error)
  if (isHttpError(error)) {
    res.error(error.message, error.statusCode)
  } else {
    res.error("An unknown error occurred", 400)
  }
})

export default app
