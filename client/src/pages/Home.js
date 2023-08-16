import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import uniqid from "uniqid";
import { API_URL } from "../apiConfig";
import { ColorRing } from "react-loader-spinner";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        setPosts(posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        <h2 className="d-flex justify-content-center">Main Feed</h2>
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
