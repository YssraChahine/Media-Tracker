import styled from "styled-components";

export default function RatingBadge({ rating, votes }) {
  if (!rating) {
    return <Fallback>No rating available</Fallback>;
  }

  return (
    <Wrapper>
      <Score> ⭐ {rating.toFixed(1)}</Score>

      <Votes>{formatVotes(votes)} ratings</Votes>
    </Wrapper>
  );
}

function formatVotes(votes) {
  if (!votes) return "0";

  if (votes >= 1000000) {
    return `${(votes / 1000000).toFixed(1)}M`;
  }

  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}K`;
  }

  return votes;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  margin: 24px 0;
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    rgba(229, 9, 20, 0.22),
    rgba(255, 48, 64, 0.12)
  );
  border: 1px solid rgba(229, 9, 20, 0.35);
  backdrop-filter: blur(12px);
  color: #ff727b;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  box-shadow:
    0 10px 25px rgba(229, 9, 20, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 35px rgba(229, 9, 20, 0.28);
  }
`;

const Votes = styled.span`
  color: #a8a8a8;
  font-size: 0.92rem;
  letter-spacing: 0.02em;
`;

const Fallback = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 12px 18px;
  border-radius: 18px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.03)
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #8f8f8f;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
`;
