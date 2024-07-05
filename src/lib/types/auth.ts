export type regDriverBodyDT = {
  fullName: string
  phoneNumber: string
  email: string
  password: string
}

export type VerifyOtpDT = {
  otp: number
  email: string
}

export type loginDriverBodyDT = {
  email: string
  password: string
}
