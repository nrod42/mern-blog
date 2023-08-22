import React, { useState, useContext } from "react";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { API_URL } from "../apiConfig";
import Button from "react-bootstrap/Button";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import ReactQuillEditor from "./ReactQuillEditor"; // Import your ReactQuillEditor component

const PostComment = ({ comment, handleUpdate }) => {
  const { _id, post, commentAuthor, commentContent, createdAt } = comment;
  const { userInfo } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(commentContent);

  const deleteComment = async () => {
    try {
      const response = await fetch(`${API_URL}/post/${post}/comments/${_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        // Handle error conditions here
      }

      handleUpdate();
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const editComment = async () => {
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditedComment(commentContent);
  };

  const submitEdit = async () => {
    try {
      const response = await fetch(`${API_URL}/post/${post}/comments/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentContent: editedComment,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setEditing(false);
        handleUpdate();
      } else {
        // Handle error conditions here
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <p className="fw-bold">
        <Link to={`/user/${commentAuthor._id}`}>{commentAuthor.username}</Link>
      </p>

      {editing ? (
        <ReactQuillEditor
          value={editedComment}
          onChange={setEditedComment}
        />
      ) : (
        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(commentContent),
          }}
        />
      )}

      <p className="text-muted">
        {format(new Date(createdAt), "MMMM d, yyyy h:mm a")}
      </p>

      {userInfo?.id === commentAuthor._id ? (
        <div>
          {editing ? (
            <div>
              <Button variant="success" onClick={submitEdit}>
                Submit
              </Button>
              <Button variant="danger" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          ) : (
            <div>
              <Button variant="dark" onClick={editComment}>
                Edit
              </Button>
              <Button variant="danger" onClick={deleteComment}>
                Delete
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PostComment;
