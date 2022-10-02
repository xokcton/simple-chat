import React from 'react'
import axios from "../../axios"
import { useNavigate } from "react-router-dom"

import { Button, useToast, VStack } from '@chakra-ui/react'
import { Input } from '../ui'
import { setToast, validateEmail } from "../../utils"

const initialState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  picture: "",
}

const extensions = ["image/jpeg", "image/jpg", "image/png"]

const SignUp = () => {
  const [formState, setFormState] = React.useState(initialState)
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleChange = (field, value) => {
    setFormState(prevState => ({ ...prevState, [field]: value }))
  }

  const postDetails = async pic => {
    setLoading(true)
    if (pic === undefined) {
      toast(setToast("Please Select an Image!", "warning"))
      return
    }

    if (extensions.indexOf(pic.type) !== -1) {
      const data = new FormData()
      data.append("file", pic)
      data.append("upload_preset", "course-work")
      data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME)

      try {
        const response = await axios.post(process.env.REACT_APP_API_BASE_URL, data)
        const d = response.data.secure_url.toString()
        setFormState(prevState => ({ ...prevState, picture: d }))
        setLoading(false)
      } catch (error) {
        toast(setToast(`Cloudinary Error: ${error}`, "error"))
        setLoading(false)
      }
    } else {
      toast(setToast("Please Select ONLY an Image!", "warning"))
      setLoading(false)
    }
  }

  const submitHandler = async () => {
    setLoading(true)
    if (!formState.name.trim().length || !formState.email.trim().length || !formState.password.trim().length || !formState.confirmPassword.trim().length) {
      toast(setToast("Please Fill all the Fields!", "warning"))
      setLoading(false)
      return
    }

    if (!validateEmail(formState.email.trim())) {
      toast(setToast("Please Enter Correct Email!", "warning"))
      setLoading(false)
      return
    }

    if (formState.password !== formState.confirmPassword) {
      toast(setToast("Passwords Do Not Match!", "warning"))
      setLoading(false)
      return
    }

    try {
      const body = { ...formState }
      delete body.confirmPassword
      const { data } = await axios.post("/api/user", body)

      toast(setToast("Registration Completed Successfully!", "success"))
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/chats")
    } catch (error) {
      toast(setToast(`Server Error: ${error.response.data.message}`, "error"))
      setLoading(false)
    }
  }

  return (
    <VStack spacing="5px" color="#000">
      <Input field="name" id="first-name" handleChange={handleChange} title="Name" placeholder="Enter Your Name" isText />
      <Input field="email" id="email" handleChange={handleChange} title="Email Address" placeholder="Enter Your Email Address" isText />
      <Input field="password" id="password" handleChange={handleChange} title="Password" placeholder="Enter Your Password" isPasswd />
      <Input field="confirmPassword" id="confirm-password" handleChange={handleChange} title="Confirm Password" placeholder="Confirm Password" isPasswd />
      <Input field="picture" id="picture" handleChange={handleChange} title="Upload Your Picture" postDetails={postDetails} isPic />

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default SignUp