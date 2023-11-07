import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { API_URL } from "../apiConfig";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";

const LoginPage = () => {
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  const navigate = useNavigate();

  const { setUserInfo } = useContext(UserContext);

  const login = async (e = null) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ loginInfo }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const userInfo = await response.json();
        setUserInfo(userInfo);
        navigate("/");
      } else {
        alert("Wrong credentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Guest Login button click
  const handleGuestLogin = () => {
    // setUsername("Guest");
    // setPassword("Guest");
    setLoginInfo({username: "Guest", password: "Guest"})
    setShouldAutoSubmit(true);
  };

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value
    });
  }

  // Automatically submit the form when auto-submit condition is met
  useEffect(() => {
    if (shouldAutoSubmit && loginInfo.username === "Guest" && loginInfo.password === "Guest") {
      login();
    }
  }, [shouldAutoSubmit, loginInfo]);

  return (
    <Container className="mt-4 mb-5">
      <Form
        className="d-flex flex-column justify-content-center"
        onSubmit={login}
      >
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="dark" type="submit">
          Login
        </Button>
      </Form>
      <div className="text-center">
        <Button variant="warning" className="mt-5" onClick={handleGuestLogin}>Login as Guest</Button>
      </div>
    </Container>
  );
};

export default LoginPage;
