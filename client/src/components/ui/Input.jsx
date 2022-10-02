import React from 'react'

import { Button, FormControl, FormLabel, Input as ChakraInput, InputGroup, InputRightElement } from '@chakra-ui/react'
import { BiShow, BiHide } from "react-icons/bi"

const Input = ({ value, field, id, handleChange, title, placeholder, postDetails, isText, isPic, isPasswd }) => {
  const [show, setShow] = React.useState(false)
  const passwordId = React.useId()
  const emailId = React.useId()

  const handleClick = () => {
    setShow(prevState => !prevState)
  }

  return (
    <FormControl id={id === 'email' ? id + emailId : id === 'password' ? id + passwordId : id} isRequired>
      <FormLabel fontWeight="bold">{ title }</FormLabel>
        <InputGroup>
          {
            isPic && (
              <ChakraInput
                type="file"
                p={1.5}
                accept="image/*"
                onChange={e => postDetails(e.target.files[0])}
              />
            )
          }
          {
            isText && (
            <ChakraInput
                value={value}
                min={3}
                placeholder={ placeholder }
                onChange={e => handleChange(field, e.target.value)}
              />
            )
          }
          {
            isPasswd && (
              <>
                <ChakraInput
                  value={value}
                  min={5}
                  type={show ? "text" : "password"}
                  placeholder={placeholder}
                  onChange={e => handleChange(field, e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    { show ? <BiHide /> : <BiShow /> }
                  </Button>
                </InputRightElement>
              </>
            )
          }
        </InputGroup>
      </FormControl>
  )
}

export default Input