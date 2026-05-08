import styled from "styled-components";

export default function RatingBadge({
  rating,
  votes,
}) {
  if (!rating) {
    return (
      <Fallback>
        No rating available
      </Fallback>
    );
  }

  return (
    <Wrapper>
      <Score>
        ⭐ {rating.toFixed(1)}
      </Score>

      <Votes>
        {formatVotes(votes)} ratings
      </Votes>
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
  gap: 12px;
  flex-wrap: wrap;
  margin: 18px 0;
`;

const Score = styled.div`
  background: rgba(229, 9, 20, 0.18);
  border: 1px solid rgba(229, 9, 20, 0.4);
  color: #ff5f67;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
`;

const Votes = styled.span`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const Fallback = styled.p`
  color: #777;
  margin: 14px 0;
`;