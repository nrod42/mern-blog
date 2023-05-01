import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import uniqid from "uniqid";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/posts").then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  return (
    <div>
      <h1 className="d-flex justify-content-center">BLOG SITE</h1>
      <div>
        {posts.length > 0 &&
          posts.map((post) => <Post key={uniqid()} {...post} />)}
      </div>
    </div>
  );
};

export default Home;
