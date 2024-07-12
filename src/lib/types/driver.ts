export type RegisterPassengerDT = {
  fullName: string
  phoneNumber: string
  location: string
  driverEmail: string
}

export type GetMeDT = {
  email: string
}

export type SendVoiceDT = {
  senderEmail: string
  voiceBase64: string
}

export type SendNotificationDT = {
  notification: {
    title?: string
    body: string
  }
  data?: {
    voiceBase64: string
  }
  tokens: string[]
}
