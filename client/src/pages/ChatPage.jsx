import React from "react"
import { useNavigate } from "react-router-dom"
import { Box } from "@chakra-ui/react"

import { ChatState } from "../context/ChatProvider"
import { SideDrawer, MyChats, ChatBox } from "../components/ui"

const ChatPage = () => {
  const navigate = useNavigate()
  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = React.useState(false)

  React.useEffect(() => {
    if (!localStorage.getItem("userInfo")) navigate("/")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ width: "100%" }}>
      {
        user && <SideDrawer />
      }
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {
          user && (
            <>
              <MyChats fetchAgain={fetchAgain} />
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </>
          )
        }
      </Box>
    </div>
  )
}

export default ChatPage