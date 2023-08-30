import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { API_URL } from "../apiConfig";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

const Post = ({ _id, postTitle, postSummary, postAuthor, createdAt, postImg }) => {
  return (
    <Row className="post">
      <Col md={6}>
        <Link to={`/post/${_id}`}>
          <Image
            src={`${API_URL}/${postImg}`}
            alt=""
            fluid
            rounded
            // style={{maxHeight: '600px', width: 'auto', objectFit: 'cover'}}
          />
        </Link>
      </Col>
      <Col md={6} className="d-flex flex-column gap-2">
        <Row className="postInfo d-flex flex-column gap-2">
          <Link to={`/post/${_id}`} className={"postLink"}>
            <h3>{postTitle}</h3>
          </Link>
        </Row>
        <Row className="d-flex align-items-center">
          <p className="text-muted d-flex gap-2">
            <Link to={`/user/${postAuthor?._id}`} className={"postLink"}>
              <span className="fw-bold">{postAuthor?.username}</span>
            </Link>
            
            <span>{format(new Date(createdAt), "M/dd/yy h:mm a")}</span>
          </p>
        </Row>
        <Row>
          <div>{postSummary}</div>
        </Row>
      </Col>
    </Row>
  );
};

export default Post;
