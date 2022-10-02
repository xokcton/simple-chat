import { Router } from "express"
import asyncHandler from "express-async-handler"

import protect from "../middleware/authMiddleware.js"
import { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } from "../controllers/chatControllers.js"

const router = Router()

router.route('/')
  .get(asyncHandler(protect), asyncHandler(fetchChats))
  .post(asyncHandler(protect), asyncHandler(accessChat))

router.route('/group')
  .post(asyncHandler(protect), asyncHandler(createGroupChat))
  .put(asyncHandler(protect), asyncHandler(renameGroup))

router.route('/groupadd')
  .put(asyncHandler(protect), asyncHandler(addToGroup))

router.route('/groupremove')
  .put(asyncHandler(protect), asyncHandler(removeFromGroup))


export default router