import dotenv from "dotenv"
import createHttpError from "http-errors"
import { SendNotificationDT } from "lib/types/driver"
import admin from "../../firebase"

dotenv.config()

export const sendNotification = async (message: SendNotificationDT) => {
  try {
    const response = await admin.messaging().sendMulticast(message)
    if (!response.successCount) {
      throw createHttpError(
        400,
        "The registration token is not a valid FCM registration token"
      )
    } else {
      throw createHttpError(200, "Successfully sent notification")
    }
  } catch (error) {
    console.log(error)
    throw createHttpError(400, error)
  }
}
