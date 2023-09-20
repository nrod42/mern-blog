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
import UserPageFollowingList from "./UserPageFollowingList";

const UserPage = () => {
  const { userInfo: loggedUserInfo } = useContext(UserContext); // Get logged in user's info

  const [userInfo, setUserInfo] = useState("");

  const { _id, about, profilePic, username, posts, likes, follows, createdAt } = userInfo;

  // SHow/Hide Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [updateTimestamp, setUpdateTimestamp] = useState(Date.now());
  const [isFollowingUser, setIsFollowingUser] = useState(false);

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

  // useEffect(() => {
  //   if (userInfo) {
  //     checkFollowingStatus();
  //   }
  // }, [userInfo]);

  
  // // Check if the logged-in user is following the post author
  // const checkFollowingStatus = async () => {
  //   try {
  //     const userResponse = await fetch(`${API_URL}/user/${userInfo.id}`);
  //     const userData = await userResponse.json();
  //     setIsFollowingUser(userData.follows.some(item => item._id === userInfo.username._id));
  //   } catch (error) {
  //     console.error("Error checking following status:", error);
  //   }
  // };

  // const toggleFollowUser = async () => {
  //   try {
  //     const endpoint = isFollowingUser
  //       ? `unfollow`
  //       : `follow`;
  
  //     // const res = 
  //     await fetch(`${API_URL}/user/${userInfo.id}/${endpoint}`, {
  //       method: isFollowingUser ? "DELETE" : "POST",
  //       body: JSON.stringify({ loggedInUserId: userInfo?.id }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       credentials: "include",
  //     });
  
  //     // if (res.ok) {
  //     //   setUpdate(true);
  //     // } else {
  //     //   console.error(`Error ${isFollowingUser ? "un" : ""}following user:`, res.status, res.statusText);
  //     // }
  //   } catch (error) {
  //     console.error(`Error ${isFollowingUser ? "un" : ""}following user:`, error);
  //   }
  // };

  if (!userInfo) return "";

  return (
    <Container>
      <Row className="pb-5">
        <Col md={2} className="d-flex flex-column justify-content-start align-items-center">
        <div style={{ height: '200px', width: '200px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image
                  src={`${API_URL}/${profilePic ? profilePic : 'uploads/default-user-pic.png'}`}
                  alt=""
                  fluid
                  roundedCircle
                  style={{ minHeight: '200px' }}
                />
              </div>
        </Col>
        <Col md={9}>
          <h3>{username}</h3>
          <p className="text-muted fw-bold">Member Since: {format(new Date(createdAt), "MMM d, yyyy")}</p>
          <p className="fw-bold">About Me:</p>
          <p
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(about),
            }}
          />
          
        </Col>
        <Col md={1}>
            {loggedUserInfo?.id === _id ? (
              <Button variant="dark" onClick={handleShow}>
                Edit
              </Button>
            ): (
              <Button
                variant="link"
                // onClick={toggleFollowUser}
                style={{ color: isFollowingUser ? '#332D2D' : '#E4A11B' , textDecoration: 'none'}}
              >
                {isFollowingUser ? "Following" : "Follow"}
              </Button>
            )}
          </Col>
      </Row>

      <Row className='pt-5 pb-5' style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
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

      <Row className='pt-5 pb-5' style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
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

      <Row className='pt-5 pb-5' style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
        <Col className="d-flex flex-column gap-4">
          <h3 className="mb-3 text-center">Follows</h3>
          <UserPageFollowingList follows={follows} />
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
