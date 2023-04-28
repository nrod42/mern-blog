import React from "react";
import { format } from "date-fns";

const Post = ({ postTitle, postSummary, author, createdAt, postImg }) => {
  return (
    <div
      className="post"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        margin: "50px 0",
      }}
    >
      <div className="postImg">
        <img src={`http://localhost:8080/${postImg}`} alt=""></img>
      </div>
      <div
        className="postContent"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <h2 className="postTitle">{postTitle}</h2>
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
