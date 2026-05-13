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
  gap: 14px;
  margin: 20px 0 28px;
  align-items: center;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  backdrop-filter: blur(12px);
  color: white;
  font-size: 0.95rem;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
  &::placeholder {
    color: #7d7d7d;
  }
  &:focus {
    outline: none;
    transform: translateY(-1px);
    border-color: rgba(229, 9, 20, 0.45);
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.05)
    );
  }
`;

const Button = styled.button`
  padding: 16px 24px;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #e50914, #ff3040);
  color: white;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  box-shadow: 0 12px 24px rgba(229, 9, 20, 0.22);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 35px rgba(229, 9, 20, 0.35);
  }
  &:active {
    transform: scale(0.98);
  }
  @media (max-width: 640px) {
    width: 100%;
  }
`;
