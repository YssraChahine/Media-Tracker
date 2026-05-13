import styled from "styled-components";
import MediaCard from "./MediaCard";

export default function UpcomingSection({ upcoming, onToggle, addedIds }) {
  if (!upcoming.length) {
    return <Fallback>No upcoming releases found.</Fallback>;
  }

  return (
    <Wrapper>
      <Heading>Coming Soon</Heading>

      <ScrollRow>
        {upcoming.map((item) => (
          <CardWrapper key={item.id}>
            <MediaCard
              item={item}
              onToggle={onToggle}
              isAdded={addedIds.includes(item.id)}
              upcoming
            />

            <ReleaseDate>
              {formatDate(item.release_date || item.first_air_date)}
            </ReleaseDate>
          </CardWrapper>
        ))}
      </ScrollRow>
    </Wrapper>
  );
}

function formatDate(dateString) {
  if (!dateString) return "Unknown";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const Wrapper = styled.section`
  margin-top: 100px;
  position: relative;
`;

const Heading = styled.h2`
  position: relative;
  display: inline-block;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  letter-spacing: -2px;
  margin-bottom: 34px;
  background: linear-gradient(to bottom, #ffffff, #9f9f9f);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 70%;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(229, 9, 20, 1),
      rgba(229, 9, 20, 0)
    );
  }
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 26px;
  overflow-x: auto;
  padding: 12px 4px 24px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardWrapper = styled.div`
  min-width: 240px;
  max-width: 240px;
  flex-shrink: 0;
  scroll-snap-align: start;
  transition: transform 0.25s ease;
  &:hover {
    transform: translateY(-4px);
  }
  @media (max-width: 768px) {
    min-width: 180px;
    max-width: 180px;
  }
`;

const ReleaseDate = styled.div`
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 18px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.06),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  color: #d0d0d0;
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
`;

const Fallback = styled.div`
  margin-top: 30px;
  padding: 40px 30px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  color: #999;
  text-align: center;
`;
