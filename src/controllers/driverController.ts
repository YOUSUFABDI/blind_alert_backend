import dotenv from "dotenv"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import prisma from "../../prisma/client"
import { RegisterPassengerDT, SendVoiceDT } from "../lib/types/driver"
import { GetMeDT } from "lib/types/driver"

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
        Voice: true,
      },
    })
    if (!driver) {
      throw createHttpError(404, "Driver not found.")
    }

    const passenger = await prisma.passenger.findFirst({
      where: { driverId: driver.id },
    })

    res.status(200).json({
      voices: driver.Voice.map((voice) => {
        return {
          voiceId: voice.id,
          voice: voice.voice,
          senderEmail: driver.email,
          reciver: {
            reciverId: passenger.id,
            reciverFullName: passenger.fullName,
            reciverPhoneNumber: passenger.phoneNumber,
            reciverLocation: passenger.location,
          },

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
    const { senderEmail, receiverId, voiceBase64 } = req.body
    if (!senderEmail || !receiverId || !voiceBase64) {
      throw createHttpError(400, "All fields are required.")
    }

    const driver = await prisma.driver.findFirst({
      where: { email: senderEmail },
    })
    if (!driver) {
      throw createHttpError(404, "Driver not found.")
    }

    const receiver = await prisma.passenger.findUnique({
      where: { id: receiverId },
    })
    if (!receiver) {
      throw createHttpError(404, "Passenger not found.")
    }

    await prisma.voice.create({
      data: {
        voice: voiceBase64,
        senderId: driver.id,
        receiver: receiver.id,
        createdDT: new Date(),
      },
    })

    res.status(201).json({ message: "Voice sent successfully." })
  } catch (error) {
    next(error)
  }
}

export default { registerPassenger, getMe, getVoices, sendVoice }
