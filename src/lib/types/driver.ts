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
  receiverId: number
  voiceBase64: any
}
