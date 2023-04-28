import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

  return <div>Post</div>;
};

export default PostPage;
