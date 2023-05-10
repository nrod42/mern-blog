import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await fetch(
          `https://mernblog-api-2lf4.onrender.com/post/${id}`
        );
        const postInfo = await response.json();
        setPostInfo(postInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostInfo();
  }, []);

  if (!postInfo) return "";
  return (
    <Col className="d-flex flex-column gap-3">
      <Row>
        <h1>{postInfo.postTitle}</h1>
      </Row>

      <Row>
        <Col md="auto" style={{ fontWeight: "bold" }}>
          {postInfo.author.username}
        </Col>

        <Col md="auto">
          {format(new Date(postInfo.createdAt), "MMM d, yyyy h:mm a")}
        </Col>

        {userInfo.id === postInfo.author._id && (
          <Col md="auto">
            <Link to={`/edit/${postInfo._id}`}>Edit</Link>
          </Col>
        )}
      </Row>

      <Image
        src={`https://mernblog-api-2lf4.onrender.com/${postInfo.postImg}`}
        alt=""
        fluid
        rounded
        style={{ height: "auto", width: "100%" }}
      />

      <Row>
        <div>{postInfo.postContent}</div>
      </Row>
    </Col>
  );
};

export default PostPage;
