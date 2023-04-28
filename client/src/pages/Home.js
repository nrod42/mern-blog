import { useState, useEffect } from "react";
import Post from "../components/Post";
import uniqid from "uniqid";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/posts").then((res) => {
      res.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);

  // const samplePost = {
  //   title: "This is a post",
  //   author: "Nigel Rodriguez",
  //   date: new Date().toLocaleString("en-US"),
  //   text: "This is the first of many blog posts in this new blog site. I am very excited as this is my first Full-Stack MERN Site! I am now one step closer to learning it all.",
  //   imgUrl:
  //     "https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0",
  // };

  return (
    <div>
      {posts.length > 0 &&
        posts.map((post) => <Post key={uniqid()} {...post} />)}
    </div>
  );
};

export default Home;
