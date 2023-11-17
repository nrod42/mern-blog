import React, { useState, useEffect, useContext } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import uniqid from "uniqid";
import { API_URL } from "../apiConfig";
import { UserContext } from "../UserContext";
// import HomePageHeader from "./HomePageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
// import HomePageSidebar from "./HomePageSidebar";

const Home = () => {
  const { userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    setLoading(true);

    const fetchPosts = async () => {
      try {
        let response;

        if (activeTab === "home") {
          response = await fetch(`${API_URL}/posts`);
        } else if (activeTab === "following" && userInfo) {
          // Only fetch if there is a logged-in user
          response = await fetch(`${API_URL}/posts/${userInfo.id}/following`);
        }

        const posts = await response.json();
        setPosts(posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, userInfo]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      {/* <HomePageHeader posts={posts} /> */}
      <Container className="mt-4 mb-4 ">
        <h1 className="text-center mb-3">Post'd</h1>
        <Row>
          <Col className="d-flex flex-column gap-4">
            {userInfo && (
              <div className="mt-4 mb-4 text-center">
                <ButtonGroup>
                  <Button
                    variant={activeTab === "home" ? "dark" : "outline-dark"}
                    onClick={() => setActiveTab("home")}
                  >
                    Home
                  </Button>
                  <Button
                    variant={activeTab === "following" ? "dark" : "outline-dark"}
                    onClick={() => setActiveTab("following")}
                  >
                    Following
                  </Button>
                </ButtonGroup>
              </div>
            )}
            <Row className="gx-5 gy-5">
              {posts?.map((post) => (
                <Col
                  key={uniqid()}
                  xs={12}
                  sm={6}
                  className="d-flex justify-content-center"
                >
                  <Post {...post} />
                </Col>
              ))}
            </Row>
          </Col>
          {/* <Col md={3}>
            <HomePageSidebar posts={posts}/>
          </Col> */}
        </Row>
      </Container>
      
    </>
  );
};

export default Home;
