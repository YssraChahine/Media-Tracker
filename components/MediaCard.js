import styled from "styled-components";

export default function MediaCard({ item, onAdd, isAdded }) {
  return (
    <Card>
      <Poster
        src={
          item.poster_path
            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
            : "/placeholder.jpg"
        }
        alt={item.title || item.name}
      />
      <Overlay />
      <Content>
        <Title>{item.title || item.name}</Title>
        <Type>{item.media_type}</Type>

        <AddButton onClick={() => onAdd(item)} disabled={isAdded}>
          {isAdded ? "✓ Added" : "+ Add"}
        </AddButton>
      </Content>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  cursor: pointer;
  transform: translateY(0);
  transition: all 0.25s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
  &:hover img {
    transform: scale(1.08);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.2),
    transparent
  );
`;

const Content = styled.div`
  position: absolute;
  padding: 16px;
  bottom: 0;
  width: 100%;
  color: white;
`;

const Title = styled.p`
  font-size: 1rem;
  margin-bottom: 4px;
`;

const Type = styled.p`
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  font-size: 0.75rem;
  background: ${({ disabled }) => (disabled ? "#ffffff66" : "#0070f3")};
  color: white;
  backdrop-filter: blur(10px);
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: 0.2s;
  &:hover {
    background: ${({ disabled }) =>
      disabled ? "rgba(255,255,255,0.4)" : "#0059c1"};
  }
`;
