import { Chat, User } from "../models/index.js"
import { customError } from "../utils/index.js"


export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) return res.sendStatus(400)

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ]
    }).populate("users", "-password").populate("latestMessage")
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name picture email"
    })

    if (isChat.length > 0) res.json(isChat[0])
    else {
      const chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId]
      }

      const createdChat = await Chat.create(chatData)
      const populatedChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")

      res.status(200).json(populatedChat)
    }
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const fetchChats = async (req, res) => {
  try {
    let data = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 })
    data = await User.populate(data, {
      path: "latestMessage.sender",
      select: "name picture email"
    })
    res.status(200).json(data)
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const createGroupChat = async (req, res) => {
  try {
    const { users, name } = req.body

    if (!users || !name) return res.status(400).json({ message: "Please Fill All the Fields!" })

    const parsedUsers = JSON.parse(users)

    if (parsedUsers.length < 2) return res.status(400).json({ message: "More than 2 users required to form a group chat!" })

    parsedUsers.push(req.user)
    const groupChat = await Chat.create({
      chatName: name,
      users: parsedUsers,
      isGroupChat: true,
      groupAdmin: req.user
    })
    const populatedGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

    res.status(201).json(populatedGroupChat)
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId, {
      chatName
    }, {
      new: true
    }).populate("users", "-password").populate("groupAdmin", "-password")

    if (!updatedChat) customError(res, 404, "Chat Not Found!")
    else res.json(updatedChat)
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body
    const added = await Chat.findByIdAndUpdate(chatId, {
      $push: { users: userId }
    }, {
      new: true
    }).populate("users", "-password").populate("groupAdmin", "-password")

    if (!added) customError(res, 404, "Chat Not Found!")
    else res.json(added)
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body
    const removed = await Chat.findByIdAndUpdate(chatId, {
      $pull: { users: userId }
    }, {
      new: true
    }).populate("users", "-password").populate("groupAdmin", "-password")

    if (!removed) customError(res, 404, "Chat Not Found!")
    else res.json(removed)
  } catch (error) {
    customError(res, 400, error.message)
  }
}