import React from "react";
import { BiPowerOff } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
export const LogOut = ({ socketRef, currUser }) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    socketRef.current.emit("logout", { userId: currUser._id });
    localStorage.clear();
    navigate("/login");
  };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
  }
  color: #ebe7ff;
`;
