import Post from "../components/Post";

const Home = () => {
  const samplePost = {
    title: "This is a post",
    author: "Nigel Rodriguez",
    date: new Date().toLocaleString("en-US"),
    text: "This is the first of many blog posts in this new blog site. I am very excited as this is my first Full-Stack MERN Site! I am now one step closer to learning it all.",
    imgUrl:
      "https://fastly.picsum.photos/id/237/536/354.jpg?hmac=i0yVXW1ORpyCZpQ-CknuyV-jbtU7_x9EBQVhvT5aRr0",
  };

  return (
    <div>
      <Post {...samplePost} />
      <Post {...samplePost} />
    </div>
  );
};

export default Home;
