import { Message, User, Chat } from "../models/index.js"
import { customError } from "../utils/index.js"


export const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).populate("sender", "name picture email").populate("chat")

    res.json(messages)
  } catch (error) {
    customError(res, 400, error.message)
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body

    if (!content, !chatId) {
      customError(res, 400, "Ivalid data passed into request!")
      return res.sendStatus(400)
    }

    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    }

    let message = await Message.create(newMessage)
    message = await message.populate("sender", "name picture")
    message = await message.populate("chat")
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name picture email',
    })

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    })

    res.json(message)
  } catch (error) {
    customError(res, 400, error.message)
  }
}