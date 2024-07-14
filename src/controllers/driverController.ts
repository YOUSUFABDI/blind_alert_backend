import dotenv from "dotenv"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import { GetMeDT, SendNotificationDT } from "lib/types/driver"
import prisma from "../../prisma/client"
import { RegisterPassengerDT, SendVoiceDT } from "../lib/types/driver"
import { sendNotification } from "../lib/utils/sendNotification"

dotenv.config()

const registerPassenger: RequestHandler<
  unknown,
  unknown,
  RegisterPassengerDT,
  unknown
> = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, location, driverEmail } = req.body
    if (!fullName || !phoneNumber || !location || !driverEmail) {
      throw createHttpError(400, "All fields are required.")
    }

    const driver = await prisma.driver.findFirst({
      where: { email: driverEmail },
    })
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
        driverId: driver.id,
        createdDT: new Date(),
      },
    })

    res.success("Passenger registered successfully.")
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

    res.success(null, {
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

const getVoices: RequestHandler<
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

    // const passenger = await prisma.passenger.findFirst({
    //   where: { driverId: driver.id },
    // })

    res.success(null, {
      voices: driver.Voice.map((voice) => {
        return {
          voiceId: voice.id,
          voice: voice.voice,
          senderEmail: driver.email,
          // receiver: passenger
          //   ? {
          //       receiverId: passenger.id,
          //       receiverFullName: passenger.fullName,
          //       receiverPhoneNumber: passenger.phoneNumber,
          //       receiverLocation: passenger.location,
          //     }
          //   : null,

          createdDT: voice.createdDT,
        }
      }),
    })
  } catch (error) {
    next(error)
  }
}

const sendVoice: RequestHandler<
  unknown,
  unknown,
  SendVoiceDT,
  unknown
> = async (req, res, next) => {
  try {
    const { senderEmail, voiceBase64 } = req.body
    if (!senderEmail || !voiceBase64) {
      throw createHttpError(400, "All fields are required.")
    }

    const driver = await prisma.driver.findFirst({
      where: { email: senderEmail },
      include: {
        Passenger: true,
      },
    })
    if (!driver) {
      throw createHttpError(404, "Driver not found.")
    }
    if (driver.Passenger.length === 0) {
      throw createHttpError(400, "You don't have any passengers.")
    }

    await prisma.voice.create({
      data: {
        voice: voiceBase64,
        senderId: driver.id,
        senderEmail: driver.email,
        createdDT: new Date(),
      },
    })

    // get all FCM tokens of the driver's passengers
    const passengerTokens = await prisma.fcmTokens.findMany({
      where: {
        passengerId: { in: driver.Passenger.map((passenger) => passenger.id) },
      },
    })

    // Filter out empty or invalid tokens
    const tokens = passengerTokens
      .map((token) => token.fcmToken)
      .filter((token) => token)
    if (tokens.length === 0) {
      throw createHttpError(200, "Voice sent to active passangers.")
    }

    const message: SendNotificationDT = {
      notification: {
        title: "Blind alert",
        body: "You have recieved a new voice message.",
      },
      data: {
        title: "Blind alert",
        body: "You have recieved a new voice message",
      },
      tokens,
    }
    await sendNotification(message)

    res.success("Voice sent and notification sent successfully.")
  } catch (error) {
    next(error)
  }
}

export default { registerPassenger, getMe, getVoices, sendVoice }
