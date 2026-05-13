import styled from "styled-components";

export default function GenreTag({ label }) {
  return <Tag>{label}</Tag>;
}

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.08);
  color: white;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;
