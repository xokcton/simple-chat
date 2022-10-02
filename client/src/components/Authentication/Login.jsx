import React from 'react'
import axios from '../../axios'
import { useNavigate } from 'react-router-dom'

import { Button, useToast, VStack } from '@chakra-ui/react'
import { Input } from '../ui'
import { setToast, validateEmail } from '../../utils'

const initialState = {
  email: "",
  password: "",
}

const Login = () => {
  const [formState, setFormState] = React.useState(initialState)
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormState(prevState => ({...prevState, [field]: value}))
  }

  const submitHandler = async () => {
    setLoading(true)
    if (!formState.email.trim().length || !formState.password.trim().length) {
      toast(setToast("Please Fill all the Fields!", "warning"))
      setLoading(false)
      return
    }

    if (!validateEmail(formState.email.trim())) {
      toast(setToast("Please Enter Correct Email!", "warning"))
      setLoading(false)
      return
    }

    try {
      const { data } = await axios.post("/api/user/login", formState)
      toast(setToast("You Have Successfully Logged In!", "success"))
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/chats")
    } catch (error) {
      setLoading(false)
      toast(setToast(`Server Error: ${error.response.data.message}`, "error"))
    }
  }

  return (
    <VStack spacing="5px" color="#000">
      <Input value={formState.email} field="email" id="email" handleChange={handleChange} title="Email Address" placeholder="Enter Your Email Address" isText />
      <Input value={formState.password} field="password" id="password" handleChange={handleChange} title="Password" placeholder="Enter Your Password" isPasswd />

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setFormState({email: "guest@example.com", password: "123456789" })
        }}
      >
        Get Guest User Credentials
      </Button>
      <Button
        variant="solid"
        colorScheme="purple"
        width="100%"
        onClick={() => {
          setFormState({email: "admin@admin.com", password: "admin123456789" })
        }}
      >
        Get Admin Credentials
      </Button>
      <Button
        variant="solid"
        colorScheme="orange"
        width="100%"
        onClick={() => {
          setFormState({email: "testUser@example.com", password: "123456789" })
        }}
      >
        Get Test User Credentials
      </Button>
    </VStack>
  )
}

export default Login