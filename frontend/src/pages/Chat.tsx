import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import { Welcome } from "../components/Welcome";
import { ChatContainer } from "../components/ChatContainer";
import { Socket, io } from "socket.io-client";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currUser, setCurrUser] = useState(undefined);
  const [currChat, setCurrChat] = useState(undefined);
  const [isLoaded, setIsloaded] = useState(false);
  const navigate = useNavigate();
  const socket = useRef<Socket | null>(null);
  useEffect(() => {
    async function isLoggedIn() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsloaded(true);
      }
    }
    isLoggedIn();
  }, [navigate]);

  useEffect(() => {
    if (currUser) {
      socket.current = io(host);
      if (socket.current) socket.current.emit("add-user", currUser._id);
    }
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [currUser]);

  useEffect(() => {
    async function getAllUsers() {
      if (currUser) {
        if (currUser.isAvatarImageSet) {
          const { data } = await axios.get(`${allUsersRoute}/${currUser._id}`);

          setContacts(data.users);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    if (currUser) getAllUsers();
  }, [currUser, navigate]);

  const handleChangeChat = (chat) => {
    setCurrChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currUser={currUser}
          changeChat={handleChangeChat}
        />
        {isLoaded ? (
          currChat === undefined ? (
            <Welcome currUser={currUser} />
          ) : (
            <ChatContainer
              currUser={currUser}
              currSelectedChat={currChat}
              socket={socket}
            />
          )
        ) : null}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000088;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat;
