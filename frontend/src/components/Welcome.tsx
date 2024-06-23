import React from "react";
import Robot from "../assets/robot.gif";
import styled from "styled-components";
export const Welcome = ({ currUser }) => {
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{currUser.username}!</span>
      </h1>
      <h1>Please select a chat to start messaging</h1>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
