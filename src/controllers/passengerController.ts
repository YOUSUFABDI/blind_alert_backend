import dotenv from "dotenv"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import prisma from "../../prisma/client"
import { LoginPassengerDT } from "../lib/types/passenger"

dotenv.config()

const loginPassenger: RequestHandler<
  unknown,
  unknown,
  LoginPassengerDT,
  unknown
> = async (req, res, next) => {
  try {
    const { phoneNumber, fcmToken } = req.body
    if (!phoneNumber || !fcmToken) {
      throw createHttpError(400, "Phone number and fcmToken is required.")
    }

    const passenger = await prisma.passenger.findFirst({
      where: { phoneNumber: phoneNumber },
    })
    if (!passenger) {
      throw createHttpError(404, "Passenger not found.")
    }

    // save the fcm token.
    const existingFcmToken = await prisma.fcmTokens.findFirst({
      where: { passengerId: passenger.id },
    })
    if (!existingFcmToken) {
      await prisma.fcmTokens.create({
        data: {
          passengerId: passenger.id,
          fcmToken: fcmToken,
          createdDT: new Date(),
        },
      })
    } else {
      await prisma.fcmTokens.update({
        where: { id: existingFcmToken.id },
        data: {
          fcmToken: fcmToken,
        },
      })
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

const getLastVoice: RequestHandler<
  unknown,
  unknown,
  { email: string },
  unknown
> = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      throw createHttpError(400, "Email is required.")
    }

    const driver = await prisma.driver.findFirst({
      where: { email: email },
      include: {
        Voice: {
          orderBy: {
            createdDT: "desc",
          },
        },
      },
    })
    if (!driver) {
      throw createHttpError(404, "Driver not found.")
    }

    if (!driver.Voice || driver.Voice.length === 0) {
      throw createHttpError(404, "No voice message from your driver yet.")
    }

    res.success(null, {
      id: driver.Voice[0].id,
      voiceBase64: driver.Voice[0].voice,
      senderEmail: driver.email,
      senderPhoneNumber: driver.phoneNumber,
      createdDT: driver.Voice[0].createdDT,
    })
  } catch (error) {
    next(error)
  }
}

export default { loginPassenger, getMe, getLastVoice }
