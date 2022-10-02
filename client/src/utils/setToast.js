const setToast = (title, status, position = "bottom", duration = 5000, isClosable = true) => ({
  title,
  status,
  duration,
  isClosable,
  position
})

export default setToast