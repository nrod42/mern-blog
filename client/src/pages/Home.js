import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import uniqid from "uniqid";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/posts");
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
        <h1 className="d-flex justify-content-center">BLOG SITE</h1>
      </Row>
      {posts.map((post) => (
        <Row key={uniqid()}>
          <Col>
            <Post {...post} />
          </Col>
        </Row>
      ))}
    </Col>
  );
};

export default Home;
