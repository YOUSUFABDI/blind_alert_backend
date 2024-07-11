import * as admin from "firebase-admin"
import dotenv from "dotenv"

dotenv.config()

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
})

export default admin
// why
