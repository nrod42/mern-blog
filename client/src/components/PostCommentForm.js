import React, { useState, useContext } from "react";
import ReactQuillEditor from "../components/ReactQuillEditor";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { API_URL } from "../apiConfig";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

const PostCommentForm = ({handleUpdate}) => {

const { id } = useParams();
const { userInfo } = useContext(UserContext);

const [commentContent, setCommentContent] = useState("");

    const postComment = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${API_URL}/post/${id}/comments`, {
            method: "POST",
            body: JSON.stringify({ commentContent, userInfo }),
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
    
          if (!response.ok) {
            console.error('Error posting comment');
          } else {
            // Call the handleCommentAdded callback to trigger a re-render
            handleUpdate();
            // Clear the comment input field
            setCommentContent("");
          }
        } catch (error) {
          console.error(error);
        }
      };

    return (
        <Form onSubmit={postComment}>
            <Form.Group className="mb-3" controlId="postText">
            <Form.Label>Leave a Comment:</Form.Label>
            <ReactQuillEditor
                value={commentContent}
                onChange={(newValue) => setCommentContent(newValue)}
            />
            </Form.Group>
            <Button variant="primary" type="submit">
            Post
            </Button>
        </Form>
    )
}

export default PostCommentForm