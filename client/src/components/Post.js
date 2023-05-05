import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import Row  from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";



const Post = ({ _id, postTitle, postSummary, author, createdAt, postImg }) => {
  return (
    <Row className="post">
      <Col md={6}>
        <Link to={`/post/${_id}`} >
          <div className="postImg">
            <Image
              src={`http://localhost:8080/${postImg}`}
              alt=""
              fluid
            />
          </div>
        </Link>
      </Col>
      <Col md={6}>
        <div className="postInfo d-flex flex-column gap-2">
          <Link to={`/post/${_id}`} className={"postLink"}
>
            <h2 className="postTitle">{postTitle}</h2>
          </Link>
          <div className="postMeta d-flex align-items-center">
            <span className="postAuthor me-2">{author.username}</span>
            <span className="postDate text-muted">
              {format(new Date(createdAt), "MMM d, yyyy h:mm a")}
            </span>
          </div>
          <div className="postSummary">{postSummary}</div>
        </div>
      </Col>
    </Row>
  );
};

export default Post;
