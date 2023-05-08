import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Create = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImg, setPostImg] = useState("");

  const navigate = useNavigate();

  // React Quill Toolbar Options
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

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

      <Form.Group className="mb-3" controlId="newPostImg">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          type="file"
          // value={postImgs}
          onChange={(e) => setPostImg(e.target.files)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="postText">
        <Form.Label>Body</Form.Label>
        <ReactQuill
          modules={modules}
          formats={formats}
          value={postContent}
          onChange={(newValue) => setPostContent(newValue)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Create Post
      </Button>
    </Form>
  );
};

export default Create;
