import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserContext } from "../UserContext";
import { API_URL } from "../apiConfig";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ username, password }),
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
    setUsername("Guest");
    setPassword("Guest");
    setShouldAutoSubmit(true);
  };

  // Automatically submit the form when auto-submit condition is met
  useEffect(() => {
      if (shouldAutoSubmit && username === "Guest" && password === "Guest") {
          login();
      }
  }, [shouldAutoSubmit, username, password]);

  return (
    <>
      <Form
        className="d-flex flex-column justify-content-center"
        onSubmit={login}
      >
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <div className="text-center">
        <Button variant="success" className="mt-5" onClick={handleGuestLogin}>Login as Guest</Button>
      </div>
    </>
  );
};

export default LoginPage;
