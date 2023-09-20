import { Link } from 'react-router-dom';
import { API_URL } from '../../apiConfig';
import { format } from "date-fns";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import editIcon from '../../icons/edit-icon.svg';
import deleteIcon from '../../icons/trash-icon.svg';
import heartIcon from '../../icons/heart-icon.svg';
import heartIconLiked from '../../icons/heart-icon-liked.svg';

const PostPageHeader = ({ postInfo, userInfo, toggleFollowUser, isFollowingAuthor, toggleLikePost, isPostLiked, deletePost }) => {
    const { _id, postTitle, postAuthor, updatedAt } = postInfo;

    return (
        <>
            <h1>{postTitle}</h1>
            <div className="text-muted d-flex justify-content-between">   
                <div className="d-flex flex-column justify-content-center align-items-start">
                    <div className="d-flex flex-row">
                        <div className="d-flex align-items-center gap-3">
                        <Link to={`/user/${postAuthor?._id}`} className={"postLink"}>
                            <div style={{height: '50px', width: '50px', borderRadius: '50%', overflow: 'hidden'}}>
                            <Image
                                src={`${API_URL}/${postAuthor.profilePic ? postAuthor.profilePic : 'uploads/default-user-pic.png'}`}
                                alt=""
                                fluid
                                roundedCircle
                                style={{minHeight: '50px'}}
                            />
                            </div>
                        </Link>
                        <div className="d-flex flex-column align-items-start">
                            <div className="d-flex justify-content-center align-items-center">
                                <Link to={`/user/${postAuthor?._id}`} className={"postLink"}>
                                    <div className="fw-bold ">{postAuthor?.username}</div>
                                </Link>
                                {userInfo && userInfo?.id !== postAuthor?._id ? (
                                    <Button
                                    variant="link"
                                    onClick={toggleFollowUser}
                                    style={{ color: isFollowingAuthor ? '#332D2D' : '#E4A11B' , textDecoration: 'none'}}
                                    >
                                    {isFollowingAuthor ? "Following" : "Follow"}
                                    </Button>
                                ) : null}
                                </div>
                                <div className="d-flex gap-2 flex-wrap">
                                    <strong>Last Updated: </strong>
                                    {format(new Date(updatedAt), "M/d/yy h:mm a")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {userInfo ? (
                    <div>
                        {/* Show edit and delete buttons for post author */}
                        {userInfo?.id === postAuthor?._id ? (
                            <>
                            <Link to={`/edit/${_id}`}>
                                <img src={editIcon} style={{height: '2.5rem'}}/>
                            </Link>
                            {/* <Button variant="danger" > */}
                                <img src={deleteIcon} className="ms-2" onClick={deletePost}  style={{height: '2.5rem'}}/>
                            {/* </Button> */}
                            </>
                        ) : (
                            <img src={isPostLiked ? heartIconLiked : heartIcon} onClick={toggleLikePost} />
                        )}
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default PostPageHeader;