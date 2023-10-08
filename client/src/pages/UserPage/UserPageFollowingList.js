import React from "react";
import { Link } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import uniqid from "uniqid";
import { API_URL } from "../../apiConfig";

const UserPageFollowingList = ({follows}) => {
    return (
        <>
            {follows.map((user) => (
                <Col md={2} key={uniqid()}>
                    <Link to={`/user/${user._id}`}>
                        <p className="text-center">{user.username}</p>
                    </Link>
                    <div style={{ height: '200px', width: '200px', borderRadius: '50%', overflow: 'hidden' }}>
                        <Image
                            src={`${API_URL}/${user.profilePic ? user.profilePic : 'uploads/default-user-pic.png'}`}
                            alt=""
                            fluid
                            roundedCircle
                            style={{ minHeight: '200px' }}
                        />
                    </div>
                </Col>
            ))}
        </>
    )};

export default UserPageFollowingList