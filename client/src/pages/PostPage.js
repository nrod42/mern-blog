import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
import DOMPurify from "dompurify";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/post/${id}`);
        const postInfo = await response.json();
        setPostInfo(postInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostInfo();
  }, []);

  const deletePost = async () => {
    try {
      const res = await fetch(`http://localhost:8080/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            <Link to={`/edit/${postInfo._id}`}>
              <Button variant="success">Edit</Button>
            </Link>
          </Col>
        )}

        {userInfo.id === postInfo.author._id && (
          <Col md="auto">
            <Button variant="danger" onClick={deletePost}>
              Delete
            </Button>
          </Col>
        )}
      </Row>

      <Image
        src={`http://localhost:8080/${postInfo.postImg}`}
        alt=""
        fluid
        rounded
        style={{ height: "auto", width: "100%" }}
      />

      <Row>
        {/* Makes sure user inputted HTML is safe*/}
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(postInfo.postContent),
          }}
        />
      </Row>
    </Col>
  );
};

export default PostPage;
