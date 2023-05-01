import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Post = ({ _id, postTitle, postSummary, author, createdAt, postImg }) => {
  return (
    <div
      className="post"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "30px",
        margin: "50px 0",
      }}
    >
      <Link to={`/post/${_id}`}>
        <div className="postImg">
          <img
            src={`http://localhost:8080/${postImg}`}
            alt=""
            style={{ width: "100%", height: "auto" }}
          ></img>
        </div>
      </Link>
      <div
        className="postContent"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <Link to={`/post/${_id}`}>
          <h2 className="postTitle">{postTitle}</h2>
        </Link>
        <div className="postMeta">
          <span className="postAuthor" style={{ fontWeight: "bold" }}>
            {author.username}
          </span>{" "}
          <span className="postDate">
            {format(new Date(createdAt), "MMM d, yyyy h:mm a")}
          </span>
        </div>
        <div className="postText">{postSummary}</div>
      </div>
    </div>
  );
};

export default Post;
