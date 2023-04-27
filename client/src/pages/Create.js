import Form from "react-bootstrap/Form";

const Create = () => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="newPostTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control />
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPostText">
        <Form.Label>New Post</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Form.Group controlId="newPostImg" className="mb-3">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type="file" />
      </Form.Group>
    </Form>
  );
};

export default Create;
