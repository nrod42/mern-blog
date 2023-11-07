import React from "react";
import { API_URL } from "../apiConfig";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const HomePageHeader = ({ posts }) => {
  return (
    <header> 
      <Container>
        <h1>Post'd</h1>
        <h2 className="pt-3 pb-3">Featured Content</h2>
        <Row>
          <Col md={6}>
            <div className="headerImgWrapper">
              <img
                src={`${API_URL}/${posts[0]?.postImg}`}
                alt="Featured Post"
                className="headerImg"
              />
            </div>
          </Col>
          <Col md={6}>
            <p className="fw-bold">{posts[0]?.postTitle}</p>
            <p>{posts[0]?.postSummary}</p>
            <p>{posts[0]?.createdAt}</p>
            <p>Last Updated: {posts[0]?.updatedAt}</p>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default HomePageHeader;
