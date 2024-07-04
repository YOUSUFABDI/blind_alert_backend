import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { RequestHandler } from "express"
import createHttpError from "http-errors"
import { loginDriverBodyDT, regDriverBodyDT, VerifyOtpDT } from "lib/types/auth"
import prisma from "../../prisma/client"
import { generateOtp } from "../lib/utils/generateOtp"
import { sendOtpEmail } from "../lib/utils/sendOtpEmail"

dotenv.config()

const registerDriver: RequestHandler<
  unknown,
  unknown,
  regDriverBodyDT,
  unknown
> = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body
    if (!fullName || !phoneNumber || !email || !password) {
      throw createHttpError(400, "Some fields are missing.")
    }

    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [{ email }, { phoneNumber: phoneNumber }],
      },
    })
    if (existingDriver) {
      throw createHttpError(
        409,
        "Driver with this email or phone number already exists."
      )
    }

    const otpCode = generateOtp()
    await sendOtpEmail(email, otpCode)

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.otp.create({
      data: {
        otp: otpCode,
        driver: {
          create: {
            fullName,
            phoneNumber,
            email,
            password: hashedPassword,
            createdDT: new Date(),
          },
        },
        status: "unused",
        createdDT: new Date(),
      },
    })

    res.status(201).json({ message: "OTP code sent to email." })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

const verifyOtpCode: RequestHandler<
  unknown,
  unknown,
  VerifyOtpDT,
  unknown
> = async (req, res, next) => {
  try {
    const { fullName, phoneNumber, email, password, otp } = req.body
    if (!email || !otp || !fullName || !phoneNumber || !password) {
      throw createHttpError(400, "Some fields are missing.")
    }

    const existingOtp = await prisma.otp.findFirst({
      where: {
        otp,
        status: "unused",
        driver: {
          email,
        },
      },
      include: {
        driver: true,
      },
    })
    if (!existingOtp) {
      throw createHttpError(400, "Invalid OTP.")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.driver.update({
      where: { id: existingOtp.driver.id },
      data: {
        fullName,
        phoneNumber,
        email,
        password: hashedPassword,
        createdDT: new Date(),
      },
    })

    await prisma.otp.update({
      where: { id: existingOtp.id },
      data: { status: "used" },
    })

    res.status(201).json({ message: "Driver registered successfully." })
  } catch (error) {
    next(error)
  }
}

const loginDriver: RequestHandler<
  unknown,
  unknown,
  loginDriverBodyDT,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw createHttpError(400, "Email and password are required.")
    }

    const driver = await prisma.driver.findFirst({
      where: {
        email,
      },
    })
    if (!driver) {
      throw createHttpError(401, "Invalid email or password.")
    }

    const isPasswordValid = await bcrypt.compare(password, driver.password)
    if (!isPasswordValid) {
      throw createHttpError(401, "Invalid email or password.")
    }

    res.status(200).json({ message: "Logged in successful." })
  } catch (error) {
    next(error)
  }
}

export default { registerDriver, verifyOtpCode, loginDriver }
