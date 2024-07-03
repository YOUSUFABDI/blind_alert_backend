import { RequestHandler } from "express"
import { loginDriverBodyDT, regDriverBodyDT } from "lib/types/driver"

const registerDriver: RequestHandler<
  unknown,
  unknown,
  regDriverBodyDT,
  unknown
> = async (req, res, next) => {}

const loginDriver: RequestHandler<
  unknown,
  unknown,
  loginDriverBodyDT,
  unknown
> = async (req, res, next) => {}

export default { registerDriver, loginDriver }
