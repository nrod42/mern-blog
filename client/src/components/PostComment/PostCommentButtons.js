import Button from "react-bootstrap/Button";
import editIcon from '../../icons/edit-icon.svg';
import deleteIcon from '../../icons/trash-icon.svg';

const PostCommentButtons = ({ editing, submitEdit, cancelEdit, editComment, deleteComment }) => {
    return (
        <div className="mt-3 d-flex justify-content-center align-items-center">
            {editing ? (
                <div className="d-flex gap-2">
                    <Button variant="warning" onClick={submitEdit}>
                        Submit
                    </Button>
                    <Button variant="dark" onClick={cancelEdit}>
                        Cancel
                    </Button>
                </div>
            ) : (
                <div>
                    <img className="editBtnIcon" src={editIcon} onClick={editComment} />
                    <img className="delBtnIcon" src={deleteIcon} onClick={deleteComment} />
                </div>
            )}
        </div>
    );
}
  export default PostCommentButtons;