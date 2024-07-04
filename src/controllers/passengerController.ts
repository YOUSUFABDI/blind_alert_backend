import dotenv from "dotenv"
import { RequestHandler } from "express"
import { LoginPassengerDT } from "../lib/types/driver"
import createHttpError from "http-errors"
import prisma from "../../prisma/client"

dotenv.config()

const loginPassenger: RequestHandler<
  unknown,
  unknown,
  LoginPassengerDT,
  unknown
> = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body
    if (!phoneNumber) {
      throw createHttpError(400, "Phone number is required.")
    }

    const passenger = await prisma.passenger.findFirst({
      where: { phoneNumber: phoneNumber },
    })
    if (!passenger) {
      throw createHttpError(404, "Passenger not found.")
    }

    res.status(200).json({ message: "Logged in successful." })
  } catch (error) {
    next(error)
  }
}

export default { loginPassenger }
