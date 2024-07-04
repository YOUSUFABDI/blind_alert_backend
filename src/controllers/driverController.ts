import dotenv from "dotenv"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import prisma from "../../prisma/client"
import { RegisterPassengerDT } from "../lib/types/driver"
import { GetMeDT } from "lib/types/auth"

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

const getMe: RequestHandler<unknown, unknown, GetMeDT, unknown> = async (
  req,
  res,
  next
) => {
  try {
    const { email } = req.body
    if (!email) {
      throw createHttpError(400, "Email is required.")
    }

    const driver = await prisma.driver.findFirst({
      where: { email: email },
      include: {
        Passenger: true,
      },
    })
    if (!driver) {
      throw createHttpError(404, "Driver not found.")
    }

    res.status(200).json({
      id: driver.id,
      fullName: driver.fullName,
      phoneNumber: driver.phoneNumber,
      email: driver.email,
      createdDT: driver.createdDT,
      passengers: driver.Passenger.map((passenger) => ({
        id: passenger.id,
        fullName: passenger.fullName,
        phoneNumber: passenger.phoneNumber,
        location: passenger.location,
        createdDT: passenger.createdDT,
      })),
    })
  } catch (error) {
    next(error)
  }
}

export default { registerPassenger, getMe }
