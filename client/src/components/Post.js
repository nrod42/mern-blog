import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { API_URL } from "../apiConfig";
import Card from 'react-bootstrap/Card';

const Post = ({ _id, postTitle, postSummary, postAuthor, createdAt, postImg }) => {
  return (
    <Card>
      <Link to={`/post/${_id}`}>
        <Card.Img variant="top" src={`${API_URL}/${postImg}`} />
      </Link>
      <Card.Body>
        <Link to={`/post/${_id}`}>
          <Card.Title>{postTitle}</Card.Title>
        </Link>
        <Card.Text>
          {postSummary}
        </Card.Text>
      </Card.Body> 
      <Card.Footer className="text-muted d-flex justify-content-between" >
        <Link to={`/user/${postAuthor?._id}`}>
          {postAuthor?.username} 
        </Link>
        <span>{format(new Date(createdAt), "M/dd/yy h:mm a")}</span>
      </Card.Footer>
    </Card>
  );
};

export default Post;
