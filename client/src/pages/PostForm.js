import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuillEditor from "../components/ReactQuillEditor";
import "react-quill/dist/quill.snow.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { API_URL } from "../apiConfig";
import Container from "react-bootstrap/Container";

const PostForm = ({ isEditing }) => {
  const { id } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImg, setPostImg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchPostInfo = async () => {
        try {
          const response = await fetch(`${API_URL}/post/${id}`);
          const postInfo = await response.json();
          setPostTitle(postInfo.postTitle);
          setPostSummary(postInfo.postSummary);
          setPostContent(postInfo.postContent);
        } catch (error) {
          console.error("Error fetching post:", error);
        }
      };

      fetchPostInfo();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("postTitle", postTitle);
    data.set("postSummary", postSummary);
    data.set("postContent", postContent);
    if (postImg?.[0]) {
      data.set("postImg", postImg?.[0]);
    }

    try {
      const response = await fetch(isEditing ? `${API_URL}/post/${id}` : `${API_URL}/create`, {
        method: isEditing ? "PUT" : "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        if (isEditing) {
          navigate(`/post/${id}`);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="postTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="postSummary">
          <Form.Label>Summary</Form.Label>
          <Form.Control
            value={postSummary}
            onChange={(e) => setPostSummary(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="newPostImg">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setPostImg(e.target.files)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="postText">
          <ReactQuillEditor
            value={postContent}
            onChange={(newValue) => setPostContent(newValue)}
          />
        </Form.Group>
        <Button variant="dark" type="submit">
          {isEditing ? "Update Post" : "Create Post"}
        </Button>
      </Form>
    </Container>
  );
};

export default PostForm;
