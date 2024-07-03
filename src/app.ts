import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import createHttpError, { isHttpError } from "http-errors"
import driverRouter from "./routes/driverRoutes"

const app = express()

app.use(express.json())
app.use(cors())
app.options("*", cors())

app.get("/", (req, res) => {
  res.json({ message: "Wagwan!" })
})
app.use("/api/v1/driver", driverRouter)

app.use((req, res, next) => {
  next(createHttpError(404, "Enpoint not found!"))
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occurred"
  let statusCode = 500
  console.log(error)

  if (isHttpError(error)) {
    errorMessage = error.message
    statusCode = error.statusCode
  }

  res.status(statusCode).json({ error: errorMessage })
})

export default app
