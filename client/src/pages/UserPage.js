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

const UserPage = () => {
  const { userInfo: loggedUserInfo } = useContext(UserContext); // Get logged in user's info

  const [userInfo, setUserInfo] = useState("");

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
      <Row>
        <Col md={3} className="d-flex flex-column justify-content-start align-items-center">
          <Image
            src={`${API_URL}/${userInfo.profilePic ? userInfo.profilePic : 'uploads/default-user-pic.png'}`}
            alt=""
            fluid
            rounded
            // style={{maxHeight: '200px'}}
          />
          </Col>
          <Col md={9}>
          <h3>@{userInfo.username}</h3>
          <p>{`${userInfo.firstName} ${userInfo.lastName}`}</p>
          <p className="fw-bold">About Me:</p>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(userInfo.about),
            }}
          />
          <p>Member Since: {format(new Date(userInfo.createdAt), "MMM d, yyyy")}</p>
          {loggedUserInfo?.id === userInfo._id && (
            <Button variant="dark" onClick={handleShow}>
              Edit
            </Button>
          )}
        </Col>
        </Row>

        <Row>
          <Col className="d-flex flex-column gap-4">
            <h3 className="text-center">Recent Posts</h3>
            <Row>
              {userInfo.posts.map((post) => (
                <Col md={6} key={uniqid()}>
                  <Post
                    {...post}
                    postAuthor={{ username: userInfo.username, _id: userInfo._id }}
                  />
                </Col>
              ))}
            </Row>
            <div className="text-center">
              <Button variant="dark">See All Posts</Button>
            </div>
          </Col>
        </Row>

        <Row>
          <h3 className="text-center">Recently Liked Posts</h3>
          <div className="text-center">
            <Button variant="dark">Show All</Button>
          </div>
        </Row>

        <Row>
          <h3 className="text-center">Follows</h3>
          <div className="text-center">
            <Button variant="dark">Show All</Button>
          </div>
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
