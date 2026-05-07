import styled from "styled-components";
import MediaCard from "./MediaCard";

export default function RecommendationsSection({
  recommendations,
  onToggle,
  addedIds,
}) {
  if (!recommendations.length) {
    return <Fallback>No recommendations available yet.</Fallback>;
  }

  return (
    <Wrapper>
      <Heading>Recommended For You</Heading>

      <Grid>
        {recommendations.map((item) => (
          <MediaCard
            key={item.id}
            item={{
              ...item,
              media_type:
                item.media_type || (item.first_air_date ? "tv" : "movie"),
            }}
            onToggle={onToggle}
            isAdded={addedIds.includes(item.id)}
          />
        ))}
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin-top: 60px;
`;

const Heading = styled.h2`
  font-size: 1.7rem;
  margin-bottom: 20px;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`;

const Fallback = styled.p`
  margin-top: 40px;
  color: #999;
`;
