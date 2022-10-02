import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import { customError } from "../utils/index.js"

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select("-password")

      next()
    } catch (error) {
      customError(res, 401, "Not Authorized, token failed!")
    }
  }

  if (!token) {
    customError(res, 401, "Not Authorized, no token!")
  }
}

export default protect