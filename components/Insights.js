import styled from "styled-components";

export default function Insights({ media }) {
  const total = media.length;
  const planned = media.filter((item) => item.status === "planned").length;
  const inProgress = media.filter(
    (item) => item.status === "in progress"
  ).length;
  const completed = media.filter((item) => item.status === "completed").length;
  const favorites = media.filter((item) => item.isFavorite).length;

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
  background: #1f1f1f;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
  border: 1px solid #2a2a2a;
`;

const Number = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
  color: #e50914;
`;

const Label = styled.p`
  margin-top: 4px;
  font-size: 0.8rem;
  color: #aaa;
`;
