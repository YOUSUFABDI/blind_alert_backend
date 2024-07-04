import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import createHttpError, { isHttpError } from "http-errors"
import authRouter from "./routes/authRoutes"
import driverRouter from "./routes/driverRoutes"
import passengerRouter from "./routes/passengerRoutes"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.options("*", cors())

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
  let errorMessage = "An unknown error occurred"
  let statusCode = 500
  console.log(error)

  if (isHttpError(error)) {
    console.log(error)
    errorMessage = error.message
    statusCode = error.statusCode
  }

  res.status(statusCode).json({ error: errorMessage })
})

export default app
