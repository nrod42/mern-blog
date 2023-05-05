import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../UserContext";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:8080/post/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  if (!postInfo) return "";
  return (
    <div>
      <h1>{postInfo.postTitle}</h1>
      <div className="postMeta">
        <span className="postAuthor" style={{ fontWeight: "bold" }}>
          {postInfo.author.username}
        </span>{" "}
        <span className="postDate">
          {format(new Date(postInfo.createdAt), "MMM d, yyyy h:mm a")}
        </span>
        {userInfo.id === postInfo.author._id && (
          <span className="edit">
            <Link to={`/edit/${postInfo._id}`}>Edit</Link>
          </span>
        )}
      </div>
      <div className="postImg">
        <img
          src={`http://localhost:8080/${postInfo.postImg}`}
          alt=""
          style={{ width: "100%", height: "auto" }}
        ></img>
      </div>
      <div>{postInfo.postContent}</div>
    </div>
  );
};

export default PostPage;
