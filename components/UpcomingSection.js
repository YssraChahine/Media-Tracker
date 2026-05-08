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
  margin-top: 70px;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 22px;
  font-weight: 700;
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CardWrapper = styled.div`
  min-width: 220px;
  max-width: 220px;
`;

const ReleaseDate = styled.p`
  margin-top: 10px;
  color: #b3b3b3;
  font-size: 0.85rem;
`;

const Fallback = styled.p`
  color: #888;
`;
