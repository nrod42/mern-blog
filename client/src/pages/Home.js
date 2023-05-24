import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import uniqid from "uniqid";
import { API_URL } from "../apiConfig";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/posts`);
        const posts = await response.json();
        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  return (
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
  );
};

export default Home;
