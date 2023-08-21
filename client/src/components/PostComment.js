import React, { useContext } from "react";
import DOMPurify from "dompurify";
import { format } from "date-fns";
import { API_URL } from "../apiConfig";
import Button from "react-bootstrap/Button";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

const PostComment = ({comment, handleUpdate}) => {
    const { _id, post, commentAuthor, commentContent, createdAt } = comment;
    const { userInfo } = useContext(UserContext)

    const deleteComment = async () => {
        try {
            const response = await fetch(`${API_URL}/post/${post}/comments/${_id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.error("Comment not found.");
                } else if (response.status === 500) {
                    console.error("An error occurred while deleting the comment.");
                } else {
                    console.error("Unknown error:", response.statusText);
                }
            };

            handleUpdate();
        } catch (error) {
            console.error("Network error:", error);
        }
    }

    return (
        <div> 
            <p className="fw-bold"><Link to={`/user/${commentAuthor._id}`}>{commentAuthor.username}</Link></p>
            <p
                dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(commentContent),
                }}
            />
            <p className="text-muted">{format(new Date(createdAt), "MMMM d, yyyy h:mm a")}</p>
            {userInfo.id === commentAuthor._id ? (<Button variant="danger" onClick={deleteComment}>Delete</Button>) : null}
        </div>
    )
}  

export default PostComment;