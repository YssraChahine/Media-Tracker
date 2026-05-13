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
  margin-top: 90px;
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
    width: 65%;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(229, 9, 20, 1),
      rgba(229, 9, 20, 0)
    );
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 28px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 18px;
  }
`;

const Fallback = styled.div`
  margin-top: 40px;
  padding: 40px 30px;
  border-radius: 28px;
  text-align: center;
  color: #9a9a9a;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  font-size: 1rem;
`;
