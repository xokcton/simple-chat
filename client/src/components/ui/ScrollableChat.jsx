import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { Avatar, Tooltip } from '@chakra-ui/react'
import moment from "moment"

import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from "../../config/ChatLogics"
import { ChatState } from '../../context/ChatProvider'

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState()

  return (
    <ScrollableFeed>
      {
        messages && messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {
              (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.picture}
                  />
                </Tooltip>
              )
            }

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                position: "relative",
                minWidth: "140px",
                minHeight: "40px"
              }}
            >
              { m.content }
              <small
                style={{ 
                  position: "absolute",
                  right: "15px",
                  bottom: "0",
                  fontSize: "10px",
                  color: "#550000"
                }}
              >
                { moment(m.createdAt).fromNow() }
              </small>
            </span>
          </div>
        ))
      }
    </ScrollableFeed>
  )
}

export default ScrollableChat