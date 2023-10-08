import React from "react";
import { UserContextProvider } from "./UserContext";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import PostPage from "./pages/PostPage/PostPage";
import UserPage from "./pages/UserPage/UserPage";
import ResultsPage from "./pages/ResultsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import PostForm from "./pages/PostForm";

const App = () => {
  return (
    <UserContextProvider>
      <main>
        <NavBar />
        <Container className="mt-4 mb-5">
          <Routes>
            <Route index element={<Home />} />
            <Route path={"/login"} element={<LoginPage />} />
            <Route path={"/register"} element={<Register />} />
            <Route path={"/create"} element={<PostForm isEditing={false} />} />
            <Route path={"/edit/:id"} element={<PostForm isEditing={true}/>} />
            <Route path={"/post/:id"} element={<PostPage />} />
            <Route path={"/user/:id"} element={<UserPage />} />
            <Route path={"/results/:query"} element={<ResultsPage />} />
          </Routes>
        </Container>
      </main>
      <footer className="text-center">&copy; {new Date().getFullYear()} - Nigel Rodriguez</footer>
    </UserContextProvider>
  );
}

export default App;
