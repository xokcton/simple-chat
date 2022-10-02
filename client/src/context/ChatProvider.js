import { createContext, useContext, useState, useEffect } from "react"

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState()
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState()
  const [notification, setNotification] = useState([])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ChatContext.Provider value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)

export default ChatProvider