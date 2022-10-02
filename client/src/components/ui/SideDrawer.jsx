import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import NotificationBadge, { Effect } from 'react-notification-badge'
import axios from "../../axios"

import { ChatState } from "../../context/ChatProvider"
import { ProfileModal, Skeletons, UserListItem } from "../ui"
import { setToast } from '../../utils'
import { getSender } from '../../config/ChatLogics'

import { FaSearch } from "react-icons/fa"
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleSearch = async () => {
    if (!search.trim().length) {
      toast(setToast("Please Enter Something In Search Field!", "warning", "bottom-left"))
      return
    }

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

  const accessChat = async userId => {
    try {
      setLoadingChat(true)
      const { data } = await axios.post('/api/chat', { userId })

      if (!chats.find(c => c._id === data._id)) setChats(prevState => [data, ...prevState])

      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error", "bottom-left"))
      setLoadingChat(false)
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
        borderRadius="10px"
        boxShadow="lg"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaSearch fontSize="2xl" />
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans" fontWeight="bold">Just Talk</Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList
              fontSize="18px"
              fontFamily="Work sans"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {
                !notification.length ? "No New Messages." :
                notification.map(n => (
                  <MenuItem key={n._id} onClick={() => {
                    setSelectedChat(n.chat)
                    setNotification(notification.filter(notificationToFilter => notificationToFilter !== n))
                  }}>
                    {
                      n.chat.isGroupChat ? `New Message in ${n.chat.chatName}` : `New Message from ${getSender(user, n.chat.users)}`
                    }
                  </MenuItem>
                ))
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem fontWeight="bold" fontFamily="Work sans">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem fontWeight="bold" fontFamily="Work sans" onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" >Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading ? (
                <Skeletons />
              ) : (
                searchResult?.map(user => (
                  <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
                ))
              )
            }
            {
              loadingChat && <Spinner ml="auto" display="flex" />
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer