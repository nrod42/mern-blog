import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { API_URL } from "../apiConfig";

const Register = () => {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    profilePic: "uploads/default-user-pic.png",
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  

  async function register(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({form}),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("registration successful");
        navigate("/login");
      } else {
        alert("registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form
      className="d-flex flex-column justify-content-center"
      onSubmit={register}
    >
      <Form.Group className="mb-3" controlId="formEmail">
        <Form.Label>E-mail</Form.Label>
        <Form.Control
          type="email"
          placeholder="E-Mail"
          name="email"
          onChange={handleChange}
        />
      </Form.Group>
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

      <Form.Group className="mb-3" controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          placeholder="First Name"
          name="firstName"
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          placeholder="Last Name"
          name="lastName"
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant="dark" type="submit">
        Register
      </Button>
    </Form>
  );
};

export default Register;
