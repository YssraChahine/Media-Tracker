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
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  &:hover {
    transform: translateY(-6px);
    z-index: 10;
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  &:hover img {
    transform: scale(1.04);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  transition: transform 0.35s ease;
`;

const Overlay = styled.div`
  position: absolute;
  pointer-events: none;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95),
    rgba(0, 0, 0, 0.2),
    transparent
  );
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  padding: 18px;
  width: 100%;
`;

const Title = styled.p`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 6px;
  line-height: 1.3;
`;

const Type = styled.p`
  font-size: 0.78rem;
  color: #b3b3b3;
  text-transform: capitalize;
`;

const AddButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  font-size: 0.82rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  background: ${({ $active }) =>
    $active ? "#e50914" : "rgba(255,255,255,0.12)"};
  color: white;
  cursor: pointer;
  transition: 0.2s ease;
  backdrop-filter: blur(6px);
  &:hover {
    background: ${({ $active }) =>
      $active ? "#ff1f2d" : "rgba(255,255,255,0.2)"};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
`;

const TrailerButton = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.14);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: 0.2s ease;
  font-size: 0.82rem;
  font-weight: 600;
  &:hover {
    background: rgba(255, 255, 255, 0.24);
  }
`;

const UpcomingBadge = styled.div`
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 3;
  background: #e50914;
  color: white;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  box-shadow: 0 10px 20px rgba(229, 9, 20, 0.25);
`;
