import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { API_URL } from "../apiConfig";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import uniqid from "uniqid";
import EditUserModal from "../components/EditUserModal";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Post from "../components/Post";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

const UserPage = () => {
  const { userInfo: loggedUserInfo } = useContext(UserContext); // Get logged in user's info

  const [userInfo, setUserInfo] = useState("");

  const { _id, firstName, lastName, about, profilePic, username, posts, likes, follows, createdAt } = userInfo;

  // SHow/Hide Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [updateTimestamp, setUpdateTimestamp] = useState(Date.now());

  const { id } = useParams();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/user/${id}`);
        const user = await response.json();
        setUserInfo(user);
      } catch (error) {
        console.error(error);
      }
    };


    fetchUserInfo();
  }, [id, updateTimestamp]);

  if (!userInfo) return "";


  return (
    <Container>
      <Row >
        <Col md={2} className="d-flex flex-column justify-content-start align-items-center">
          <Image
            src={`${API_URL}/${profilePic ? profilePic : 'uploads/default-user-pic.png'}`}
            alt=""
            fluid
            rounded
            // style={{maxHeight: '200px'}}
          />
        </Col>
        <Col md={9}>
          <h3>{username}</h3>
          <p>{`${firstName} ${lastName}`}</p>
          <p className="fw-bold">About Me:</p>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(about),
            }}
          />
          <p>Member Since: {format(new Date(createdAt), "MMM d, yyyy")}</p>
        </Col>
        <Col md={1}>
            {loggedUserInfo?.id === _id && (
              <Button variant="dark" onClick={handleShow}>
                Edit
              </Button>
            )}
          </Col>
      </Row>

      <Row style={{marginTop: '100px', marginBottom: '100px', backgroundColor: 'rgba(100, 100, 100, .2)'}}>
        <Col className="d-flex flex-column gap-4" >
          <h3 className="mb-3 text-center">Recent Posts</h3>
          <Row>
            {posts.map((post) => (
              <Col md={6} key={uniqid()}>
                <Post
                  {...post}
                  postAuthor={{ username, _id }}
                />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="dark">See All Posts</Button>
          </div>
        </Col>
      </Row>

      <Row style={{marginTop: '100px', marginBottom: '100px', backgroundColor: 'rgba(100, 100, 100, .2)'}}>
        <Col className="d-flex flex-column gap-4">
          <h3 className="mb-3 text-center">Recently Liked Posts</h3>
          <Row>
            {likes.map((post) => (
              <Col md={6} key={uniqid()}>
                <Post
                  {...post}
                  postAuthor={ post.postAuthor }
                />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="dark">Show All</Button>
          </div>
        </Col>
      </Row>

      <Row style={{marginTop: '100px', marginBottom: '100px', backgroundColor: 'rgba(100, 100, 100, .2)'}}>
        <Col className="d-flex flex-column gap-4">
          <h3 className="mb-3 text-center">Follows</h3>
          {/* Have to make a user mini card or something, probs just the profile pic with the name */}
          <Row>
            {follows.map((user) => (
              <Col md={2} key={uniqid()}>
                <Link to={`/user/${user._id}`}>
                  <p className="text-center">{user.username}</p>
                </Link>
                <Image
                  src={`${API_URL}/${user.profilePic ? user.profilePic : 'uploads/default-user-pic.png'}`}
                  alt=""
                  fluid
                  rounded
                  // style={{maxHeight: '200px'}}
                />

              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="dark">Show All</Button>
          </div>
        </Col>
      </Row>

      <EditUserModal
        show={show}
        handleClose={handleClose}
        userInfo={userInfo}
        setUpdateTimestamp={setUpdateTimestamp}
      />
      
    </Container>
  );
};

export default UserPage;
