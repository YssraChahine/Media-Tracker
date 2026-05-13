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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #ddd;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
  backdrop-filter: blur(6px);
  &:hover {
    color: white;
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.08);
  }
`;
