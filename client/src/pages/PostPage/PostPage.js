import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { API_URL } from "../../apiConfig";
import DOMPurify from "dompurify";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import PostComment from "../../components/PostComment/PostComment";
import PostCommentForm from "../../components/PostComment/PostCommentForm";
import PostPageHeader from "./PostPageHeader";
import LoadingSpinner from "../../components/LoadingSpinner";
import uniqid from 'uniqid';

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
      setIsFollowingAuthor(userData.follows.some(item => item._id === postAuthor._id));
    } catch (error) {
      console.error("Error checking following status:", error);
    }
  };

  const checkLikedStatus = async () => {
    try {
      const userResponse = await fetch(`${API_URL}/user/${userInfo.id}`);
      const userData = await userResponse.json();
      SetIsPostLiked(userData.likes.some(item => item._id === _id));
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  }

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
      <LoadingSpinner />
    ) : (
      <Container className="mt-4 mb-5">
        <Col>
          <Row className="mb-2 text-center">
            <PostPageHeader
              postInfo={postInfo}
              userInfo={userInfo}
              toggleFollowUser={toggleFollowUser}
              isFollowingAuthor={isFollowingAuthor}
              toggleLikePost={toggleLikePost}
              isPostLiked={isPostLiked}
              deletePost={deletePost}
            />
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
          <Row className="mt-5 gap-3">
            {postComments?.map((comment) => (
              <PostComment key={uniqid()} comment={comment} handleUpdate={handleUpdate}/>
            ))}
          </Row>
        </Col>
      </Container>
  ));
};

export default PostPage;
