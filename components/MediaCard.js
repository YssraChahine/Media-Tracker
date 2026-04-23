import styled from "styled-components";

export default function MediaCard({ item, onAdd, isAdded }) {
  return (
    <Card>
      <PosterWrapper>
        <Poster
          src={
            item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : "/placeholder.jpg"
          }
          alt={item.title || item.name}
        />
      </PosterWrapper>

      <Content>
        <Title>{item.title || item.name}</Title>
        <Type>{item.media_type}</Type>

        <AddButton
          onClick={() => onAdd(item)}
          disabled={isAdded}
        >
          {isAdded ? "Added ✓" : "+ Add"}
        </AddButton>
      </Content>
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const PosterWrapper = styled.div`
  width: 100%;
  height: 320px;
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.p`
  font-weight: 600;
  margin: 0;
`;

const Type = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
`;

const AddButton = styled.button`
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  font-size: 0.8rem;
  transition: all 0.15s ease;
  background: ${({ disabled }) => (disabled ? "#ccc" : "black")};
  color: ${({ disabled }) => (disabled ? "#666" : "white")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background: ${({ disabled }) => (disabled ? "#ccc" : "#333")};
  }
`;