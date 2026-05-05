import styled from "styled-components";

export default function GenreTag({ label }) {
  return <Tag>{label}</Tag>;
}

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
`;
