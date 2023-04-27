import { useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    // Verify user profile
    fetch("http://localhost:8080/profile", {
      credentials: "include",
    }).then((res) => {
      res.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const logout = () => {
    fetch("http://localhost:8080/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="mb-5"
    >
      <Container>
        <Navbar.Brand as={Link} to={"/"}>
          MERN Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {userInfo?.username && (
              <>
                <Nav.Link as={Link} to={"/create"}>
                  New Post
                </Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            )}
            {!userInfo?.username && (
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
