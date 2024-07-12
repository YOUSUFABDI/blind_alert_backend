import createHttpError from "http-errors"
import nodemailer from "nodemailer"

import dotenv from "dotenv"

dotenv.config()

export const sendOtpEmail = async (
  email: string,
  otp: number
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const mailOptions = {
    from: `"Blind Alert" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp} Don't Share With Any One.`,
  }

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error occurred:", err.message)
      throw createHttpError(500, "Failed to send OTP email.")
    } else {
      console.log("Email sent:", info.response)
    }
  })
}
