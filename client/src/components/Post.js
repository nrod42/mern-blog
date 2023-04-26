import React from "react";

const Post = ({ title, author, date, text, imgUrl }) => {
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
        <img src={imgUrl} alt=""></img>
      </div>
      <div
        className="postContent"
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <h2 className="postTitle">{title}</h2>
        <div className="postMeta">
          <span className="postAuthor" style={{ fontWeight: "bold" }}>
            {author}
          </span>{" "}
          - <span className="postDate">{date}</span>
        </div>
        <div className="postText">{text}</div>
      </div>
    </div>
  );
};

export default Post;
