import React, { useState } from 'react'
import axios from '../../axios'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'

import { ChatState } from '../../context/ChatProvider'
import { setToast } from '../../utils'
import { UserBadgeItem, UserListItem } from "./"

import { ViewIcon } from '@chakra-ui/icons'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { selectedChat, setSelectedChat, user } = ChatState()
  const [groupChatName, setGroupChatName] = useState("")
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const toast = useToast()

  const handleRemove = async userToRemove => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast(setToast("Only Admin Can Remove Users!", "error", "bottom"))
      return
    }

    try {
      setLoading(true)
      const request = {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      }
      const { data } = await axios.put('/api/chat/groupremove', request)

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      fetchMessages()
      setLoading(false)
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom"))
      setLoading(false)
    }
  }

  const handleAddUser = async userToAdd => {
    if (selectedChat.users.find(u => u._id === userToAdd._id)) {
      toast(setToast("User Already In Group!", "warning", "bottom"))
      return
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast(setToast("Only Admin Can Add Users!", "error", "bottom"))
      return
    }

    try {
      setLoading(true)
      const request = {
        chatId: selectedChat._id,
        userId: userToAdd._id,
      }
      const { data } = await axios.put('/api/chat/groupadd', request)

      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom"))
      setLoading(false)
    }
  }

  const handleRename = async () => {
    if (!groupChatName.trim().length) {
      toast(setToast("Please Fill the Chat Name Field!", "warning", "bottom"))
      return
    }

    try {
      setRenameLoading(true)
      const request = {
        chatId: selectedChat._id,
        chatName: groupChatName.trim(),
      }
      const { data } = await axios.put('/api/chat/group', request)
      
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
      setGroupChatName("")
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom"))
      setRenameLoading(false)
    }
  }

  const handleSearch = async query => {
    setSearch(query)

    if (!query.trim().length) return

    try {
      setLoading(true)
      const { data } = await axios.get(`/api/user?search=${search.trim()}`)

      setSearchResult(data)
      setLoading(false)
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom"))
      setLoading(false)
    }
  }

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            { selectedChat.chatName }
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              display="flex"
              flexWrap="wrap"
              w="100%"
              pb={3}
            >
              {
                selectedChat && selectedChat.users.map(u => (
                  <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                ))
              }
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={e => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {
              loading ? <Spinner size="lg" mt={5} style={{ marginLeft: "calc(50% - 20px)" }} /> : (
                searchResult?.slice(0, 4).map(user => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                ))
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal