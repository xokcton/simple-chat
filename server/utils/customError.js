
const customError = (res, code, message) => {
  res.status(code)
  throw new Error(message)
}

export default customError