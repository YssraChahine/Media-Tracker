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
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
`;

const Button = styled.button`
  background: #111;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
`;
