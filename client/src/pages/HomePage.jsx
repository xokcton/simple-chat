import React from "react"
import { useNavigate } from "react-router-dom"

import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import { Login, SignUp } from "../components/Authentication"

const HomePage = () => {
  const navigate = useNavigate()
  
  React.useEffect(() => {
    if (localStorage.getItem("userInfo")) navigate("/chats")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxW="xl" centerContent>
      <Box display="flex" justifyContent="center" p={3} bg="white" w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px"  boxShadow="xl">
        <Text fontSize="4xl" fontFamily="Work sans" fontWeight="bold" color="#000">
          Just Talk
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} color="#000" borderRadius="lg" borderWidth="1px" boxShadow="xl">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage