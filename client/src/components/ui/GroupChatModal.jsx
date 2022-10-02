import { useState } from "react"
import axios from "../../axios"
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'

import { setToast } from '../../utils'
import { ChatState } from "../../context/ChatProvider"
import { UserListItem, UserBadgeItem } from "./"

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const { user, setChats } = ChatState()
  
  const handleSearch = async query => {
    setSearch(query)

    if (!query.trim().length) return
    
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/user?search=${search.trim()}`)
      setSearchResult(data)
      setSearch("")
      setLoading(false)
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom-left"))
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!groupChatName.trim().length || !selectedUsers.length) {
      toast(setToast("Please Fill All the Fields!", "warning", "top"))
      return
    }

    try {
      const request = {
        name: groupChatName.trim(),
        users: JSON.stringify(selectedUsers.map(user => user._id)),
      }
      const { data } = await axios.post('/api/chat/group', request)
      setChats(prevState => [data, ...prevState])
      setSelectedUsers([])
      setGroupChatName("")
      setSearchResult([])
      setSearch("")
      onClose()
      toast(setToast("New Group Chat Created!", "success", "bottom"))
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "top"))
    }
  }

  const handleGroup = userToAdd => {
    if (selectedUsers.includes(userToAdd)){
      toast(setToast("User Already Added!", "warning", "top"))
      return
    }
    setSelectedUsers(prevState => [...prevState, userToAdd])
  }

  const handleDelete = userToDelete => setSelectedUsers(prevState => prevState.filter(selected => selected._id !== userToDelete._id))

  return (
    <>
      <span onClick={onOpen}>{ children }</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="35px"
            fontFamily="Work sans"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <FormControl>
              <Input placeholder="Chat Name" mb={3} onChange={e => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder="Add Users e.g: Test, John, Admin" mb={1} onChange={e => handleSearch(e.target.value)} />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {
                selectedUsers?.map(u => (
                  <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                ))
              }
            </Box>
            {
              loading ? <Spinner  size="lg" mt={5} /> : (
                searchResult?.slice(0, 4).map(user => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
              )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal