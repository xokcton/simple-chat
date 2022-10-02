import { User } from "../models/index.js"
import { customError, generateToken } from "../utils/index.js"


export const registerUser = async (req, res) => {
  try {
    const { name, email, password, picture } = req.body
    if (!name || !email || !password) {
      customError(res, 400, "Please enter all the Fields!")
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      customError(res, 400, "User already exists!")
    }

    const user = await User.create({ name, email, password, picture })
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id),
      })
    } else {
      customError(res, 400, "Failed to create the user!")
    }
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    const confirmPassword = await user.confirmPassword(password)

    if (user && confirmPassword) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id),
      })
    } else {
      customError(res, 401, "Invalid Email or Password!")
    }
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
    } : {}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })

    if (users) res.status(200).json(users)
  } catch (error) {
    customError(res, 400, error.message)
  }
}