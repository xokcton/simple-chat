import React from "react"
import { useNavigate } from "react-router-dom"

const ErrorPage = () => {
  const navigate = useNavigate()

  React.useEffect(() => {
    if (localStorage.getItem("userInfo")) navigate("/chats")
    else navigate("/")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>404</div>
  )
}

export default ErrorPage