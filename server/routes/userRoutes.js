import { Router } from "express"
import asyncHandler from "express-async-handler"

import { registerUser, authUser, getAllUsers } from "../controllers/userControllers.js"
import protect from "../middleware/authMiddleware.js"

const router = Router()

router.route('/')
  .get(asyncHandler(protect), asyncHandler(getAllUsers))
  .post(asyncHandler(registerUser))

router.route('/login').post(asyncHandler(authUser))

export default router