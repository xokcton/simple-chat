import { Router } from "express"
import asyncHandler from "express-async-handler"

import { sendMessage, allMessages } from "../controllers/messageControllers.js"
import protect from "../middleware/authMiddleware.js"

const router = Router()

router.route('/')
  .post(asyncHandler(protect), asyncHandler(sendMessage))

router.route('/:chatId')
  .get(asyncHandler(protect), asyncHandler(allMessages))

export default router