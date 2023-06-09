import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";
import { API_URL } from "../apiConfig";
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
        const response = await fetch(`${API_URL}/post/${id}`);
        const postInfo = await response.json();
        setPostInfo(postInfo);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostInfo();
  }, [id]);

  const deletePost = async () => {
    try {
      const res = await fetch(`${API_URL}/post/${id}`, {
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
    <Col>
      <Row className="mb-2">
        <Col md={{ span: 8, offset: 2 }} className="text-center">
          <h1>{postInfo.postTitle}</h1>
          <div className="d-flex justify-content-center">
            <p className="text-muted">
            <Link to={`/user/${postInfo.author._id}`} className={"postLink"}><span className="fw-bold">{postInfo.author.username}</span></Link>
              {" - "}
              <span>
                {format(new Date(postInfo.createdAt), "MMM d, yyyy h:mm a")}
              </span>
            </p>
          </div>
        </Col>
        <Col md="auto" className="ms-auto my-auto text-center">
          {/* If user is not logged in or if the current user isn't the post author, don't show buttons.*/}
          {userInfo?.id === postInfo.author._id && (
            <Link to={`/edit/${postInfo._id}`}>
              <Button variant="dark">Edit</Button>
            </Link>
          )}

          {userInfo?.id === postInfo.author._id && (
            <Button variant="danger" className="ms-2" onClick={deletePost}>
              Delete
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Image
          src={`${API_URL}/${postInfo.postImg}`}
          alt=""
          fluid
          rounded
          style={{ height: "auto", width: "100%" }}
        />
      </Row>

      <Row>
        <Col>
          {/* Makes sure user inputted HTML is safe */}
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(postInfo.postContent),
            }}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default PostPage;
