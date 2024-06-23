import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

const Register = () => {
  const navigate = useNavigate();
  const toastOptions: object = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, email, username } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      if (data.status === false) toast.error(data.msg, toastOptions);
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.msg));
        toast.success("User created Successfully", {
          ...toastOptions,
          autoClose: 100,
        });
        setTimeout(() => {
          navigate("/login");
        }, 800);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = (): boolean => {
    const { password, confirmPassword, email, username } = values;
    if (password !== confirmPassword) {
      toast.error("password and confirm password must be same", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("User Name should be more 3 characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or more 8 characters",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email should not be null", toastOptions);
      return false;
    }
    return true;
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>QuickChat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(event) => handleChange(event)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(event) => handleChange(event)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(event) => handleChange(event)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(event) => handleChange(event)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    image {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
    background-color: #00000088;
    border-radius: 2rem;
    padding: 3rem 5rem;

    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.2rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;
