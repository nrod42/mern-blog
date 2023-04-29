import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);

  const params = useParams();
  useEffect(() => {
    fetch(`http://localhost:8080/post/${params.id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
    console.log(params);
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
