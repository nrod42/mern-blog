import React from "react";
import Post from "../components/Post";
import CardGroup from "react-bootstrap/CardGroup";
import Carousel from "react-bootstrap/Carousel";
import { API_URL } from "../apiConfig";

const HomePageHeader = ({ posts }) => {
  // get 3 random posts

  return (
    // <CardGroup>
    <Carousel>
      {posts.slice(0, 3).map((post) => (
        <Carousel.Item>
          <>
            <img
              src={`${API_URL}/${post.postImg}`}
              style={{ height: "200px" }}
            ></img>
            <div>{post.postAuthor.username}</div>
          </>
        </Carousel.Item>
      ))}
    </Carousel>
    // </CardGroup>
  );
};

export default HomePageHeader;
