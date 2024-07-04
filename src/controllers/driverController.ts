import dotenv from "dotenv"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import prisma from "../../prisma/client"
import { RegisterPassengerDT } from "../lib/types/driver"

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

export default { registerPassenger }
