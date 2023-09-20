import React, { useState, useContext } from "react";
import { format } from "date-fns";
import { API_URL } from "../../apiConfig";
import { UserContext } from "../../UserContext";
import PostCommentButtons from "./PostCommentButtons";
import PostCommentHeader from "./PostCommentHeader";
import PostCommentContent from "./PostCommentContent";

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
    <div className="d-flex flex-row justify-content-between align-items-center">
      <div>
        <PostCommentHeader commentAuthor={commentAuthor} />
        <PostCommentContent editing={editing} commentContent={commentContent} editedComment={editedComment} setEditedComment={setEditedComment}/>
        <div className="text-muted">
          {format(new Date(createdAt), "M/dd/yy h:mm a")}
        </div>
      </div>

      {userInfo?.id === commentAuthor._id ? 
        <PostCommentButtons 
          editing={editing}
          submitEdit={submitEdit}
          cancelEdit={cancelEdit} 
          editComment={editComment} 
          deleteComment={deleteComment}/> 
        : null
        }
    </div>
  );
};

export default PostComment;
