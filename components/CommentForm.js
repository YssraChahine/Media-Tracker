import { useState } from "react";
import styled from "styled-components";

export default function CommentForm({ onAdd }) {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Write a comment..."
        maxLength={200}
      />
      <Button>Post</Button>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: 10px;
`;

const Input = styled.input`
  background: #222;
  color: white;
  border: none;
  padding: 10px;
`;

const Button = styled.button`
  background: #e50914;
  border: none;
  color: white;
  padding: 10px;
`;
