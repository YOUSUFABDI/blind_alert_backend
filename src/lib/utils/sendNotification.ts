import dotenv from "dotenv"
import createHttpError from "http-errors"
import { SendNotificationDT } from "lib/types/driver"
import admin from "../../firebase"

dotenv.config()

export const sendNotification = async (
  message: SendNotificationDT
): Promise<void> => {
  try {
    const response = await admin.messaging().sendMulticast(message)
    if (!response.successCount) {
      throw createHttpError(
        400,
        "The registration token is not a valid FCM registration token"
      )
    }
  } catch (error) {
    console.log(error)
    throw createHttpError(400, error)
  }
}
