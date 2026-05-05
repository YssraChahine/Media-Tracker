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
  background: transparent;
  border: 1px solid #333;
  color: #ccc;
  padding: 6px 12px;
  &:hover {
    color: white;
    border-color: white;
  }
`;
