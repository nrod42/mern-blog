import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import NavBar from "./components/NavBar";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import UserPage from "./pages/UserPage";
import ResultsPage from "./pages/ResultsPage";
import { UserContextProvider } from "./UserContext";

function App() {
  return (
    <UserContextProvider>
      <main>
        <NavBar />
        <Container className="mt-4 mb-5">
          <Routes>
            <Route index element={<Home />} />
            <Route path={"/login"} element={<LoginPage />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/create"} element={<CreatePost />} />
            <Route path={"/post/:id"} element={<PostPage />} />
            <Route path={"/edit/:id"} element={<EditPost />} />
            <Route path={"/user/:id"} element={<UserPage />} />
            <Route path={"/results/:query"} element={<ResultsPage />} />
          </Routes>
        </Container>
      </main>
      <footer>NR</footer>
    </UserContextProvider>
  );
}

export default App;
