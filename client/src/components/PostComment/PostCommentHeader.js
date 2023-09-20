import { Link } from "react-router-dom";
import { API_URL } from "../../apiConfig";
import Image from "react-bootstrap/Image";

const PostCommentHeader = ({ commentAuthor }) => {
    return (
        <div className="fw-bold d-flex align-items-center gap-3">
            <div style={{ height: '50px', width: '50px', borderRadius: '50%', overflow: 'hidden' }}>
                <Image
                src={`${API_URL}/${commentAuthor.profilePic ? commentAuthor.profilePic : 'uploads/default-user-pic.png'}`}
                alt=""
                fluid
                roundedCircle
                style={{ minHeight: '50px' }}
                />
            </div>
            <Link to={`/user/${commentAuthor._id}`}>
                {commentAuthor.username}
            </Link>
        </div>
  );
}

export default PostCommentHeader;