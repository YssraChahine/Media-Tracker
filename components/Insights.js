import styled from "styled-components";

export default function Insights({ media }) {

  const safeMedia = Array.isArray(media) ? media : [];
  const total = safeMedia.length;
  const planned = safeMedia.filter(
    (item) => item.status === "planned"
  ).length;

  const inProgress = safeMedia.filter(
    (item) => item.status === "in progress"
  ).length;

  const completed = safeMedia.filter(
    (item) => item.status === "completed"
  ).length;

  const favorites = safeMedia.filter(
    (item) => item.isFavorite
  ).length;

  return (
    <Wrapper>
      <StatCard>
        <Number>{total}</Number>
        <Label>Total</Label>
      </StatCard>

      <StatCard>
        <Number>{planned}</Number>
        <Label>Planned</Label>
      </StatCard>

      <StatCard>
        <Number>{inProgress}</Number>
        <Label>In Progress</Label>
      </StatCard>

      <StatCard>
        <Number>{completed}</Number>
        <Label>Completed</Label>
      </StatCard>

      <StatCard>
        <Number>{favorites}</Number>
        <Label>Favorites</Label>
      </StatCard>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 25px 0;
  @media (min-width: 700px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 18px;
  padding: 22px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  transition: 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const Number = styled.p`
  font-size: 2rem;
  font-weight: 800;
  color: #e50914;
`;

const Label = styled.p`
  margin-top: 6px;
  font-size: 0.82rem;
  color: #aaa;
`;
