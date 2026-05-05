import styled from "styled-components";

export default function GenreTag({ label }) {
  return <Tag>{label}</Tag>;
}

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: #777;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  backdrop-filter: blur(6px);
`;