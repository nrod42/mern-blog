import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal"
import Post from "../components/Post";
import { API_URL } from "../apiConfig";
import { format } from "date-fns";
import uniqid from 'uniqid';
import EditUserModal from "../components/EditUserModal";

const UserPage = () => {
  const { userInfo: loggedUserInfo } = useContext(UserContext);

  const [userInfo, setUserInfo] = useState("")

  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
  }, [id]);

  if (!userInfo) return "";

  return (
    <Col>
      <Row className="justify-content-center">
        <Col xs={12} md={2} className="text-md-start text-center">
          <Image
            src="https://media.gq.com/photos/56436afea3bd50211a99c42d/master/w_1600%2Cc_limit/obama-gq-1215-05.jpg"
            alt=""
            fluid
            rounded
            style={{ maxHeight: "200px", width: "auto" }}
          />
        </Col>
        <Col xs={12} md={8} className="text-md-start text-center">
            <h2>@{userInfo.username}</h2>
            <p>{`${userInfo.firstName} ${userInfo.lastName}`}</p>
            <div>
              <strong>About Me:</strong>
            </div>
            <p>{userInfo.about}</p>
            <p>
                Member Since: {format(new Date(userInfo.createdAt), "MMM d, yyyy")}
            </p>
        </Col>
        {loggedUserInfo.id === userInfo._id && (
            <Col xs={12} md={2} className="text-md-start text-center">
                <Button variant="dark" onClick={handleShow}>Edit</Button>
                <Button variant="danger" className="ms-2" 
                // onClick={deleteUser}
                >
                Delete
                </Button>
            </Col>
        )}
      </Row>
      <Row>
        <Col className="d-flex flex-column align-items-center gap-4">
          <Row>
            <Col>
              <h3>Posts By: {userInfo.username}</h3>
            </Col>
          </Row>
          {userInfo.posts.map((post) => (
            <Row key={uniqid()}>
                <Col>
                    <Post {...post} author={{ username: userInfo.username , _id: userInfo._id }} />
                </Col>
            </Row>
          ))}

          <Row>
            <Col>
              <Button variant="success">See All Posts</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <EditUserModal show={show} handleClose={handleClose}/>
    </Col>
  );
};

export default UserPage;
