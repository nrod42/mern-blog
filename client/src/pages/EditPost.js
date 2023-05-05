import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditPost = () => {
  const { id } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postSummary, setPostSummary] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postImg, setPostImg] = useState("");

  const navigate = useNavigate();

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

  useEffect(() => {
    fetch(`http://localhost:8080/post/${id}`).then((res) => {
      res.json().then((postInfo) => {
        setPostTitle(postInfo.postTitle);
        setPostSummary(postInfo.postSummary);
        setPostContent(postInfo.postContent);
      });
    });
  }, []);

  const updatePost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("postTitle", postTitle);
    data.set("postSummary", postSummary);
    data.set("postContent", postContent);
    data.set("postImg", postImg[0]);
    data.set("id", id);
    await fetch("http://localhost:8080/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    navigate(`/post/${id}`);
  };

  return (
    <div>
      <Form onSubmit={updatePost}>
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
          <ReactQuill
            modules={modules}
            formats={formats}
            value={postContent}
            onChange={(newValue) => setPostContent(newValue)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update Post
        </Button>
      </Form>
    </div>
  );
};

export default EditPost;
