import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Create = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImg, setPostImg] = useState("");

  const navigate = useNavigate();

  const createNewPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("postTitle", postTitle);
    data.set("postSummary", postSummary);
    data.set("postContent", postContent);
    data.set("postImg", postImg[0]);
    await fetch("http://localhost:8080/create", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <div>
      <Form onSubmit={createNewPost}>
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

        <Form.Group controlId="newPostImg" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            // value={postImgs}
            onChange={(e) => setPostImg(e.target.files)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="postText">
          <Form.Label>New Post</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
    </div>
  );
};

export default Create;
