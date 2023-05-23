import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { API_URL } from "../apiConfig";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const { query } = useParams();

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

  return (
    <Col className="d-flex flex-column gap-4">
      <Row>
        <h1 className="d-flex justify-content-center">
          Showing results for "{query}":
        </h1>
      </Row>
      {results.map((result) => (
        <Row key={uniqid()}>
          <Col>
            <Post {...result} />
          </Col>
        </Row>
      ))}
    </Col>
  );
};

export default ResultsPage;
