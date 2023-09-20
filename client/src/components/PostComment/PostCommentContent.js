import DOMPurify from "dompurify";
import ReactQuillEditor from "../ReactQuillEditor";

const PostCommentContent = ({ editing, commentContent, editedComment, setEditedComment }) => {
    return (<div>
        {editing ? (
            <ReactQuillEditor
                value={editedComment}
                onChange={newValue => setEditedComment(newValue)}
            />
        ) : (
            <p
                dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(commentContent),
                }}
            />
        )}
    </div>
  );
};

export default PostCommentContent