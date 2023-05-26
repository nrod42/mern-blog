import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ReactQuillEditor from "../components/ReactQuillEditor";
import "react-quill/dist/quill.snow.css";
import { API_URL } from "../apiConfig";

const EditUserModal = ({ show, handleClose, userInfo, setUpdateTimestamp }) => {
  const { id } = useParams();
  // const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState(userInfo.firstName);
  const [lastName, setLastName] = useState(userInfo.lastName);
  const [about, setAbout] = useState(userInfo.about);

  const updateUser = async (e) => {
    e.preventDefault();
    // const data = new FormData();
    const data = { firstName, lastName, about };
    // data.set("email", email);
    // data.set("firstName", firstName);
    // data.set("lastName", lastName);
    console.log(data);
    // data.set("id", id);
    // if (postImg?.[0]) {
    //   data.set("postImg", postImg?.[0]);
    // }

    const res = await fetch(`${API_URL}/user/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      // await res.json();
      // console.log(response);
      // navigate(`/user/${id}`);
      setUpdateTimestamp(Date.now());
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          className="d-flex flex-column justify-content-center"
          // onSubmit={register}
        >
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              // type="password"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="postText">
            <Form.Label>About Me</Form.Label>
            <ReactQuillEditor
              value={about}
              onChange={(newAbout) => setAbout(newAbout)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={updateUser}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
