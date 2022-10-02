import React, { useState, useEffect } from 'react'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import Picker from 'emoji-picker-react'
import axios from "../../axios"
import io from "socket.io-client"
import Lottie from "react-lottie"

import { ChatState } from '../../context/ChatProvider'
import { UpdateGroupChatModal, ProfileModal, ScrollableChat } from "./"
import { getSender, getFullSenderInfo } from '../../config/ChatLogics'
import { getLottieOptions, setToast } from '../../utils'

import Robot from "../../assets/robot.gif"
import { ArrowBackIcon } from '@chakra-ui/icons'
import { BsEmojiSmileFill } from 'react-icons/bs'

const ENDPOINT = process.env.REACT_APP_API_URL
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast()
  
  const toggleEmojiPicker = () => setShowEmojiPicker(prevState => !prevState)
  const handleEmojiClick = (_, emoji) => setNewMessage(prevMsg => prevMsg += emoji.emoji)

  const fetchMessages = async () => {
    if (!selectedChat) return

    try {
      setLoading(true)
      const { data } = await axios.get(`/api/message/${selectedChat._id}`)
      setMessages(data)
      setLoading(false)

      socket.emit("join chat", selectedChat._id)
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "top"))
      setLoading(false)
    }
  }

  const sendMessage = async e => {
    if (e.key === 'Enter' && newMessage.trim().length) {
      setShowEmojiPicker(false)
      socket.emit("stop typing", selectedChat._id)
      try {
        const request = {
          content: newMessage.trim(),
          chatId: selectedChat._id,
        }
        setNewMessage("")
        const { data } = await axios.post('/api/message', request)
        socket.emit("new message", data)
        setMessages([...messages, data])
        setFetchAgain(!fetchAgain)
      } catch (error) {
        toast(setToast(`Server Error: ${error.response.data.message}`, "error", "top"))
      }
    }
  }
  
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  useEffect(() => {
    socket.on("message received", newReceivedMessage => {
      if (!selectedChatCompare || selectedChatCompare._id !== newReceivedMessage.chat._id) {
        if (!notification.includes(newReceivedMessage)) {
          setNotification([newReceivedMessage, ...notification])
          setFetchAgain(!fetchAgain)
        }

      } else {
        setMessages([...messages, newReceivedMessage])
      }
    })
  })

  const typingHandler = e => {
    setNewMessage(e.target.value)

    if (!socketConnected) return
    
    if (!typing) { 
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }

    const lastTypingTime = new Date().getTime()
    const TIMER_LENGTH = 3000
    setTimeout(() => {
      const currentTime = new Date().getTime()
      const delta = currentTime - lastTypingTime

      if (delta >= TIMER_LENGTH && typing) {
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, TIMER_LENGTH);
  }

  return (
    <>
      {
        selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {
                !selectedChat.isGroupChat ? (
                  <>
                    {
                      getSender(user, selectedChat.users)
                    }
                    <ProfileModal user={getFullSenderInfo(user, selectedChat.users)} />
                  </>
                ) : (
                  <>
                    { selectedChat.chatName.toUpperCase() }
                    <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                  </>
                )
              }
            </Text>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {
                loading ? <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" /> : (
                  <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                )
              }

              <FormControl onKeyDown={sendMessage} isRequired mt={3} display="flex" alignItems="center" justifyContent="space-between">
                <div className="emoji">
                  <BsEmojiSmileFill onClick={toggleEmojiPicker} />
                  {
                    showEmojiPicker && <Picker pickerStyle={{ position: "absolute", transform: "translate(0, -360px)" }} onEmojiClick={handleEmojiClick} />
                  }
                </div>
                <div style={{ width: "100%" }}>
                  {
                    isTyping && 
                    <Lottie
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                      options={ getLottieOptions() }
                    />
                  }
                  <Input
                  autoComplete="off"
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message..."
                  value={newMessage}
                  onChange={typingHandler}
                />
                </div>
              </FormControl>
            </Box>
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="100%">
            <img src={Robot} width="400px" alt="welcome robot" />
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on any item in the list on the left to start chatting or create a new one
            </Text>
          </Box>
        )
      }
    </>
  )
}

export default SingleChat