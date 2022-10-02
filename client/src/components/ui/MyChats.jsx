import React, { useState, useEffect } from 'react'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import axios from "../../axios"

import { ChatState } from '../../context/ChatProvider'
import { getSender } from '../../config/ChatLogics'
import { setToast } from '../../utils'
import { Skeletons, GroupChatModal } from "./"

import { AddIcon } from '@chakra-ui/icons'

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { chats, setChats, selectedChat, setSelectedChat } = ChatState()
  const toast = useToast()

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat");
      setChats(data);
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom-left"))
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="lg"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {
          chats ? (
            <Stack overflowY="scroll">
              {
                chats.map(chat => (
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "#fff" : "#000"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    <Text fontSize="20px" fontFamily="Work sans">
                      {
                        !chat.isGroupChat ? (
                          <div>
                            <p>{ getSender(loggedUser, chat.users) }</p>
                            {
                              chat?.latestMessage && (
                                <p>
                                  <b style={{ fontSize: "14px", marginRight: "5px" }} >{ chat.latestMessage.sender.name }:</b>
                                  <small  style={{ fontSize: "14px" }} >{ chat.latestMessage.content }</small>
                                </p>
                              )
                            }
                          </div>
                        ) : chat.chatName
                      }
                    </Text>
                  </Box>
                ))
              }
            </Stack>
          ): (
            <Skeletons />
          )
        }
      </Box>
    </Box>
  )
}

export default MyChats