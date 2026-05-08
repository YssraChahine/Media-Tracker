import styled from "styled-components";
import Link from "next/link";
import { useState } from "react";
import TrailerModal from "./TrailerModal";

export default function MediaCard({ item, onToggle, isAdded, upcoming }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  async function handleTrailer() {
    try {
      const response = await fetch(
        `/api/trailer/${item.media_type}/${item.id}`
      );

      const data = await response.json();

      if (data.key) {
        setTrailerKey(data.key);
        setShowTrailer(true);
      } else {
        alert("No trailer available");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
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
          {upcoming && <UpcomingBadge>Coming Soon</UpcomingBadge>}
        </PosterWrapper>

        <Content>
          <Title>{item.title || item.name}</Title>
          <Type>{item.media_type}</Type>

          <ButtonRow>
            <TrailerButton onClick={handleTrailer}>▶ Trailer</TrailerButton>

            <AddButton
              onClick={() => {
                onToggle(item);
              }}
              $active={isAdded}
            >
              {isAdded ? "✓ Added" : "+ Add"}
            </AddButton>
          </ButtonRow>
        </Content>
      </Card>
      {showTrailer && (
        <TrailerModal
          trailerKey={trailerKey}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
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

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TrailerButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(6px);
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const UpcomingBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 3;
  background: #e50914;
  color: white;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.4px;
`;