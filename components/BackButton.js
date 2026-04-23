import { useRouter } from "next/router";
import styled from "styled-components";

export default function BackButton() {
  const router = useRouter();

  function handleClick() {
    router.push("/");
  }

  return <Button onClick={handleClick}>Back to Home</Button>;
}

const Button = styled.button`
  margin-bottom: 20px;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  background: #eee;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.15s ease;

  &:hover {
    background: #ddd;
  }
`;
