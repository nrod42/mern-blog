import Button from "react-bootstrap/Button";
import editIcon from '../../icons/edit-icon.svg';
import deleteIcon from '../../icons/trash-icon.svg';

const PostCommentButtons = ({ editing, submitEdit, cancelEdit, editComment, deleteComment }) => {
    return (
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
                    <img src={editIcon} onClick={editComment} />
                    <img src={deleteIcon} onClick={deleteComment} />
                </div>
            )}
        </div>
    );
}
  export default PostCommentButtons;