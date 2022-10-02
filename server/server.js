import "dotenv/config"
import express from "express"
import cors from "cors"
import { Server } from "socket.io"

import establishDbConnection from "./config/db.js"
import { userRoutes, chatRoutes, messageRoutes } from "./routes/index.js"
import { notFound, errorHandler } from "./middleware/errorMIddleware.js"

const app = express()
const { PORT, MONGO_URL, CLIENT_URL } = process.env

app.use(express.json())
app.use(cors())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  establishDbConnection(MONGO_URL)
  console.log(`Running server on http://localhost:${PORT}`)
})

const io = new Server(server, {
  pingTimeout: 60000, // 1m
  cors: {
    origin: CLIENT_URL
  },
})

io.on("connection", (socket) => {
  socket.on('setup', userData => {
    socket.join(userData._id)
    socket.emit("connected")
  })

  socket.on("join chat", room => {
    socket.join(room)
  })

  socket.on("typing", room => socket.in(room).emit("typing"))
  socket.on("stop typing", room => socket.in(room).emit("stop typing"))

  socket.on("new message", newReceivedMessage => {
    const chat = newReceivedMessage.chat

    if (!chat.users) return

    chat.users.forEach(user => {
      if (user._id == newReceivedMessage.sender._id) return
      socket.in(user._id).emit("message received", newReceivedMessage)
    })
  })

  socket.off("setup", () => {
    socket.leave(userData._id)
  })
})
