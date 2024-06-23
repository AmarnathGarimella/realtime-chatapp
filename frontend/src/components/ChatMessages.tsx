import React from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
export const ChatMessages = ({ messages, scrollRef }) => {
  return (
    <Container>
      {messages.map((message) => {
        return (
          <div ref={scrollRef} key={uuidv4()}>
            <div
              className={`message ${message.fromSelf ? "sended" : "recieved"}`}
            >
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  overflow: auto;
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 40%;
      overflow-wrap: break-word;
      font-size: 1.1rem;
      border-radius: 0.5rem;
      color: #d1d1d1;
      padding: 0.6rem;
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #5c06a3;
    }
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #5c06a3;
    }
  }
`;
