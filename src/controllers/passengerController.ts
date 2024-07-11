import dotenv from "dotenv"
import { RequestHandler } from "express"
import { LoginPassengerDT, SaveFcmTokenDT } from "../lib/types/passenger"
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

    res.success("Logged in successful.")
  } catch (error) {
    next(error)
  }
}

const getMe: RequestHandler<
  unknown,
  unknown,
  { phoneNumber: string },
  unknown
> = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body
    if (!phoneNumber) {
      throw createHttpError(400, "Phone number is required.")
    }

    const passenger = await prisma.passenger.findFirst({
      where: { phoneNumber: phoneNumber },
      include: { driver: true },
    })
    if (!passenger) {
      throw createHttpError(404, "Passenger not found.")
    }

    res.success(null, {
      id: passenger.id,
      fullName: passenger.fullName,
      phoneNumber: passenger.phoneNumber,
      location: passenger.location,
      createdDT: passenger.createdDT,
      driverEmail: passenger.driver.email,
      driverPhoneNumber: passenger.driver.phoneNumber,
      driverName: passenger.driver.fullName,
    })
  } catch (error) {
    next(error)
  }
}

const saveFcmToken: RequestHandler<
  unknown,
  unknown,
  SaveFcmTokenDT,
  unknown
> = async (req, res, next) => {
  try {
    const { passengerPhoneNo, fcmToken } = req.body
    if (!passengerPhoneNo || !fcmToken) {
      throw createHttpError(400, "Phone number and FCM token are required.")
    }

    const passenger = await prisma.passenger.findFirst({
      where: { phoneNumber: passengerPhoneNo },
    })
    if (!passenger) {
      throw createHttpError(404, "Passenger not found.")
    }

    const existingToken = await prisma.fcmTokens.findFirst({
      where: { passengerId: passenger.id, fcmToken: fcmToken },
    })
    if (!existingToken) {
      await prisma.fcmTokens.create({
        data: {
          passengerId: passenger.id,
          fcmToken: fcmToken,
          createdDT: new Date(),
        },
      })
    }

    res.success("FCM token saved successfully.")
  } catch (error) {
    next(error)
  }
}

export default { loginPassenger, getMe, saveFcmToken }
