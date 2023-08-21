import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../apiConfig";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";

const NavBar = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  useEffect(() => {
    // Verify User Profile
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          setUserInfo(null);
          return; // Skip fetching the user profile if no token exists
        }

        const response = await fetch(`${API_URL}/profile`, {
          credentials: "include",
        });
        if (response.ok) {
          const userInfo = await response.json();
          setUserInfo(userInfo);
        } else {
          setUserInfo(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, [setUserInfo]);

  const logout =  () => {
    Cookies.remove('token');
    navigate("/");
    setUserInfo(null);
  };

  const fetchResults = async (e) => {
    e.preventDefault();
    navigate(`/results/${query}`);
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to={"/"}>
          Posted
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-between">
          <div></div>
          <Form className="d-flex" onSubmit={fetchResults}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" variant="outline-warning">
              Search
            </Button>
          </Form>
          <Nav>
            {userInfo ? (
              <>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
                <Nav.Link as={Link} to={"/create"}>
                  New Post
                </Nav.Link>
                <Nav.Link as={Link} to={`/user/${userInfo.id}`}>
                  Profile
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to={"/login"}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to={"/register"}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
