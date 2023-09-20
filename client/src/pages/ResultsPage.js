import React, { useState, useEffect } from "react";
import Post from "../components/Post";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { API_URL } from "../apiConfig";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [mergedResults, setMergedResults] = useState([])
  const { query } = useParams();

  const {postResults, userResults, commentResults} = results;

  // const mergedResults = postResults && userResults && commentResults
  // ? [...postResults, ...userResults, ...commentResults].sort((a, b) => b.score - a.score)
  // : [];
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
      // console.log(mergedResults)
  }, [results])

  //before this, make comment search its own thing within each post if possible
    //if not,fuck comments
  //first,run our search like before with the three separate results.
  //IF userResults is not empty, fetch all posts from these users
  //for our merged totalresults array, we will combine the three original results,
    // then sort by score
    // and finally, add the posts from the users we fetched before to the end
  // Now, we should see all relevant info, including posts made by the user we are searching for

  return (
    <Col className="d-flex flex-column gap-4">
      <Row>
        <h2 className="d-flex justify-content-center">
          Showing results for "{query}":
        </h2>
      </Row>
      {mergedResults?.map((result) => (
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
