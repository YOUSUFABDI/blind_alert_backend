import dotenv from "dotenv"
import { RequestHandler } from "express"
import { LoginPassengerDT, RegisterPassengerDT } from "../lib/types/driver"
import prisma from "../../prisma/client"
import createHttpError from "http-errors"

dotenv.config()

const registerPassenger: RequestHandler<
  unknown,
  unknown,
  RegisterPassengerDT,
  unknown
> = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, location, driverId } = req.body
    if (!fullName || !phoneNumber || !location || !driverId) {
      throw new Error("All fields are required.")
    }

    const driver = await prisma.driver.findUnique({ where: { id: driverId } })
    if (!driver) {
      throw createHttpError(400, "Driver not found.")
    }

    const existingPassenger = await prisma.passenger.findFirst({
      where: { OR: [{ phoneNumber: phoneNumber }] },
    })
    if (existingPassenger) {
      throw createHttpError(
        409,
        "Passenger with this phone number already exists."
      )
    }

    await prisma.passenger.create({
      data: {
        fullName,
        phoneNumber,
        location,
        driverId,
        createdDT: new Date(),
      },
    })

    res.status(201).json({ message: "Passenger registered successfully." })
  } catch (error) {
    next(error)
  }
}

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

export default { registerPassenger, loginPassenger }
