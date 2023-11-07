import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { API_URL } from "../apiConfig";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [mergedResults, setMergedResults] = useState([])
  const { query } = useParams();

  const {postResults, userResults, commentResults} = results;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_URL}/results/${query}`);
        const results = await response.json();
        setResults(results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResults();
  }, [query]);

  useEffect(() => {
    setMergedResults(postResults && userResults && commentResults
      ? [...postResults, ...userResults, ...commentResults] : [])
  }, [results])

  return (
    <Container className="mt-4 mb-5">
      <Row>
        <h2 className="d-flex justify-content-center">
          Showing results for "{query}":
        </h2>
      </Row>
      <Row>
      {mergedResults?.map((result) => (
        
          <Col key={uniqid()} md={6}>
            <Post {...result} />
          </Col>
        
      ))}
      </Row>
    </Container>
  );
};

export default ResultsPage;
