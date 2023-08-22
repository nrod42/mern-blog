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
import { ColorRing } from "react-loader-spinner";
import PostCommentForm from "../components/PostCommentForm";
import uniqid from 'uniqid';
import PostComment from "../components/PostComment";

const PostPage = () => {
  // Get the user's information from the context
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [isPostLiked, SetIsPostLiked] = useState(false);

  const navigate = useNavigate();

  const { _id, postTitle, postAuthor, postImg, postContent, postComments, createdAt, updatedAt } = postInfo;
  // Fetch post information from the API
  const fetchPostInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/post/${id}`);
      const postInfo = await response.json();
      setPostInfo(postInfo);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    setUpdate(true);
  };

  // Check if the logged-in user is following the post author
  const checkFollowingStatus = async () => {
    try {
      const userResponse = await fetch(`${API_URL}/user/${userInfo.id}`);
      const userData = await userResponse.json();
      setIsFollowingAuthor(userData.follows.includes(postAuthor._id));
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const checkLikedStatus = async () => {
    try {
      const userResponse = await fetch(`${API_URL}/user/${userInfo.id}`);
      const userData = await userResponse.json();
      SetIsPostLiked(userData.likes?.includes(_id));
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  }

  // Delete the current post
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

  const toggleFollowUser = async () => {
    try {
      const endpoint = isFollowingAuthor
        ? `unfollow`
        : `follow`;
  
      const res = await fetch(`${API_URL}/user/${postAuthor?._id}/${endpoint}`, {
        method: isFollowingAuthor ? "DELETE" : "POST",
        body: JSON.stringify({ loggedInUserId: userInfo?.id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
  
      if (res.ok) {
        setUpdate(true);
      } else {
        console.error(`Error ${isFollowingAuthor ? "un" : ""}following user:`, res.status, res.statusText);
      }
    } catch (error) {
      console.error(`Error ${isFollowingAuthor ? "un" : ""}following user:`, error);
    }
  };

  const toggleLikePost = async () => {
    try {
      const endpoint = isPostLiked
        ? `unlike`
        : `like`;

      const res = await fetch(`${API_URL}/post/${_id}/${endpoint}`, {
        method: isPostLiked ? "DELETE" : "POST",
        body: JSON.stringify({ loggedInUserId: userInfo?.id }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        setUpdate(true);
      } else {
        console.error(`Error ${isPostLiked ? "un" : ""}liking user:`, res.status, res.statusText);
      }
    } catch (error) {
      console.error(`Error ${isPostLiked ? "un" : ""}liking user:`, error);
    }
  }
  
  useEffect(() => {
    setLoading(true);
    fetchPostInfo();
  }, [id, userInfo]);

  useEffect(() => {
    if (userInfo && postAuthor) {
      checkFollowingStatus();
      checkLikedStatus();
    }
  }, [userInfo, postAuthor]);

  useEffect(() => {
    if (update) {
      fetchPostInfo();
      setUpdate(false);
    }
  }, [update]);

  if (!postInfo) return "";

  // Return loading spinner if postInfo is not available
  return (
    loading ?  
    (
      <div className="text-center mt-5 mb-5">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#198754", "#198754", "#198754", "#198754", "#198754"]}
        />
      </div>
    ) : (
    <Col>
      <Row className="mb-2">
        <Col className="text-center">
          <h1>{postTitle}</h1>
          <div className="d-flex justify-content-center">
            <p className="text-muted">
              <Link to={`/user/${postAuthor?._id}`} className={"postLink"}>
                <span className="fw-bold">
                  {postAuthor?.username}
                </span>
              </Link>
              {" - "}
              <span>
                {format(new Date(createdAt), "MMM d, yyyy h:mm a")}
              </span>


              <Button
                className={isFollowingAuthor ? "following-button" : ""}
                variant={isFollowingAuthor ? "dark" : "success"}
                onClick={toggleFollowUser}
              >
                {isFollowingAuthor ? "Following" : "Follow"}
              </Button>
            </p>
          </div>
          <p>              
            <span className="text-muted">
                last updated: {format(new Date(updatedAt), "MMM d, yyyy h:mm a")}
            </span>
          </p>
        </Col>

        {/* Render post author options */}
        <Col md="auto" className="ms-auto my-auto text-center">
          {/* Show edit and delete buttons for post author */}
          {userInfo?.id === postAuthor?._id ? (
            <>
              <Link to={`/edit/${postInfo._id}`}>
                <Button variant="dark">Edit</Button>
              </Link>
              <Button variant="danger" className="ms-2" onClick={deletePost}>
                Delete
              </Button>
            </>
          ) : (

            <Button
              className={isPostLiked ? "like-button" : ""}
              variant={isPostLiked ? "dark" : "success"}
              onClick={toggleLikePost}
            >
              {isPostLiked ? "Unlike" : "Like"}
            </Button>

          )}

        </Col>
      </Row>

      {/* Render post image */}
      <Row className="mb-4">
        <Image
          src={`${API_URL}/${postImg}`}
          alt=""
          fluid
          rounded
          style={{ height: "auto", width: "100%" }}
        />
      </Row>

      {/* Render post content */}
      <Row>
        <Col
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(postContent),
          }}
        />
     </Row>

      {/* Render comment form */}
      <Row>
        <PostCommentForm handleUpdate={handleUpdate}/>
      </Row>

      {/* Render post comments */}
      <Row className="mb-5 gap-3">
        {postComments?.map((comment) => (
          <PostComment key={uniqid()} comment={comment} handleUpdate={handleUpdate}/>
        ))}
      </Row>
    </Col>
  ));
};

export default PostPage;
