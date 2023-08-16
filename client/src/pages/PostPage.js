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
import Form from "react-bootstrap/Form";
import { ColorRing } from "react-loader-spinner";
import ReactQuillEditor from "../components/ReactQuillEditor";


const PostPage = () => {
  
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const { postTitle, author, postImg, postContent, createdAt } = postInfo;

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchPostInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/post/${id}`);
        const postInfo = await response.json();
        setPostInfo(postInfo);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false)
      }
    };

    fetchPostInfo();
  }, [id]);

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

  if (!postInfo) return "";

  return (
    loading ? (      
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
    </div>) : (
    <Col>
      <Row className="mb-2">
        <Col md={{ span: 8, offset: 2 }} className="text-center">
          <h1>{postTitle}</h1>
          <div className="d-flex justify-content-center">
            <p className="text-muted">
            <Link to={`/user/${author._id}`} className={"postLink"}><span className="fw-bold">{author.username}</span></Link>
              {" - "}
              <span>
                {format(new Date(createdAt), "MMM d, yyyy h:mm a")}
              </span>
            </p>
          </div>
        </Col>
        <Col md="auto" className="ms-auto my-auto text-center">
          {/* If user is not logged in or if the current user isn't the post author, don't show buttons.*/}
          {userInfo?.id === author._id && (
            <Link to={`/edit/${postInfo._id}`}>
              <Button variant="dark">Edit</Button>
            </Link>
          )}

          {userInfo?.id === author._id && (
            <Button variant="danger" className="ms-2" onClick={deletePost}>
              Delete
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Image
          src={`${API_URL}/${postImg}`}
          alt=""
          fluid
          rounded
          style={{ height: "auto", width: "100%" }}
        />
      </Row>

      <Row>
        <Col>
          {/* Makes sure user inputted HTML is safe */}
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(postContent),
            }}
          />
        </Col>
      </Row>

      <Row>
        {/* postInfo.comments.map() */}
        <p>COMMENTS HERE</p>
      </Row>

      <Row>
        {/* When submitted, use the post id, add this comment to the posts comment array  */}
        <Form >
          <Form.Group className="mb-3" controlId="postText">
            <Form.Label>Comment</Form.Label>
            <ReactQuillEditor
              value={comment}
              onChange={(newValue) => setComment(newValue)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Post
          </Button>
        </Form>
      </Row>

    </Col>
    )
  );
};

export default PostPage;
