import { SendNotificationDT } from "lib/types/driver"
import admin from "../../firebase"
import dotenv from "dotenv"

dotenv.config()

export const sendNotification = async (message: SendNotificationDT) => {
  try {
    const response = await admin.messaging().sendMulticast(message)
    console.log("Successfully sent message:", response.responses[0].error)
  } catch (error) {
    console.error("Error sending message:", error)
  }
}
