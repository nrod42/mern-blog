import React, { useState, useEffect, useContext } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import uniqid from "uniqid";
import { API_URL } from "../apiConfig";
import { ColorRing } from "react-loader-spinner";
import { UserContext } from "../UserContext";

const Home = () => {
  const {userInfo} = useContext(UserContext)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("main")

  useEffect(() => {
    setLoading(true);
  
    const fetchPosts = async () => {
      try {
        let response;
  
        if (activeTab === "main") {
          response = await fetch(`${API_URL}/posts`);
        } else if (activeTab === "following" && userInfo) { // Only fetch if there is a logged-in user
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
  

  return (
    loading ? (          
      <div className="text-center mt-5 mb-5">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#198754", "#198754", "#198754", "#198754", "#198754"]}
        />
      </div>
    ) : (
    <Col className="d-flex flex-column gap-4">
      <Row>
        <h2 className="d-flex justify-content-center">Posted? Logo</h2>
      </Row>
      <Row className="mb-4">
        <ButtonGroup>
          <Button
            variant={activeTab === "main" ? "dark" : "outline-dark"}
            onClick={() => setActiveTab("main")}
          >
            All
          </Button>
          {userInfo && (<Button
            variant={activeTab === "following" ? "dark" : "outline-dark"}
            onClick={() => setActiveTab("following")}
          >
            Following
          </Button>)}
        </ButtonGroup>
      </Row>
      {posts.map((post) => (
        <Row key={uniqid()}>
          <Col className="d-flex justify-content-center">
            <Post {...post} />
          </Col>
        </Row>
      ))}
    </Col>
    )
  );
};

export default Home;
