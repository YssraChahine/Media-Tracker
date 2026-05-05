import styled from "styled-components";
import Link from "next/link";

export default function MediaCard({ item, onToggle, isAdded }) {
  return (
    <Card>
      <PosterWrapper>
        <Link href={`/media/${item.media_type}/${item.id}?from=home`}>
          <Poster
            src={
              item.poster_path
                ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                : "/placeholder.jpg"
            }
            alt={item.title || item.name}
          />
        </Link>

        <Overlay />
      </PosterWrapper>

      <Content>
        <Title>{item.title || item.name}</Title>
        <Type>{item.media_type}</Type>

        <AddButton
          onClick={() => {
            onToggle(item);
          }}
          $active={isAdded}
        >
          {isAdded ? "✓ Added" : "+ Add"}
        </AddButton>
      </Content>
    </Card>
  );
}
const Card = styled.div`
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.08);
    z-index: 10;
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  &:hover img {
    transform: scale(1.08);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  pointer-events: none;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  padding: 12px;
  width: 100%;
`;

const Title = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
`;

const Type = styled.p`
  font-size: 0.7rem;
  color: #aaa;
`;

const AddButton = styled.button`
  margin-top: 6px;
  padding: 4px 8px;
  font-size: 0.7rem;
  border: none;
  background: ${({ $active }) => ($active ? "#e50914" : "#333")};
  color: white;
  cursor: pointer;
`;
