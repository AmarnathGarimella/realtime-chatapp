import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { LogOut } from "./LogOut";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";

export const ChatContainer = ({ currUser, currSelectedChat, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    async function loadChatForUsers() {
      const { data } = await axios.post(`${getAllMessagesRoute}`, {
        from: currUser._id,
        to: currSelectedChat._id,
      });
      if (data) {
        setMessages(data.projectedMessages);
      }
    }
    loadChatForUsers();
  }, [currSelectedChat, currUser]);

  const handleSendMsg = async (msg) => {
    await axios.post(`${sendMessageRoute}`, {
      from: currUser._id,
      to: currSelectedChat._id,
      message: msg,
    });

    socket.current.emit("send-msg", {
      from: currUser._id,
      to: currSelectedChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currSelectedChat.avtarImage}`}
              alt="avatar"
            />
          </div>
          <div className="username">
            <h3>{currSelectedChat.username}</h3>
          </div>
        </div>
        <LogOut socketRef={socket} currUser={currUser} />
      </div>
      <ChatMessages messages={messages} scrollRef={scrollRef} />
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0rem 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
`;
