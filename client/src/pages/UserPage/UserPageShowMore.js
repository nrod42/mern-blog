import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const UserPageShowMore = () => {
// either pass the appropriate fetch function or keep it here and fetch based on a passed name like "following" 
    // fetch following
//fetch all posts ny this user

    return (
        <>
            <h1>Guys's post</h1>
            <Row>
                {/* map though and display posts/users */}
                {posts.map((post, index) => (
                    <Col key={index} xs={12} sm={6}  className="d-flex justify-content-center mb-4">
                        <Post {...post} />
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default UserPageShowMore;