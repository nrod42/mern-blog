import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../apiConfig";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ReactQuillEditor from "../components/ReactQuillEditor";
import "react-quill/dist/quill.snow.css";

const Create = () => {
  const [formData, setFormData] = useState({
    postTitle: "",
    postSummary: "",
    postContent: "",
    postImg: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const updatedFormData = { ...formData };

    if (name === "postImg") {
      updatedFormData[name] = files[0];
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const createNewPost = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("postTitle", formData.postTitle);
    data.append("postSummary", formData.postSummary);
    data.append("postContent", formData.postContent);
    data.append("postImg", formData.postImg);

    await fetch(`${API_URL}/create`, {
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
          name='postTitle'
          value={formData.postTitle}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="postSummary">
        <Form.Label>Summary</Form.Label>
        <Form.Control
          name="postSummary"
          value={formData.postSummary}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="newPostImg">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          name="postImg"
          type="file"
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="postText">
        <Form.Label>Body</Form.Label>
        <ReactQuillEditor
          name="postContent"
          value={formData.postContent}
          onChange={(newValue) =>
            setFormData({ ...formData, postContent: newValue })
          }
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Create Post
      </Button>
    </Form>
  );
};

export default Create;
