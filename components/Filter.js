import styled from "styled-components";

export default function Filter({ filters, setFilters }) {
  function handleStatusChange(status) {
    setFilters((prev) => ({
      ...prev,
      status,
    }));
  }

  function toggleFavorites() {
    setFilters((prev) => ({
      ...prev,
      favorites: !prev.favorites,
    }));
  }

  function resetFilters() {
    setFilters({
      status: "all",
      favorites: false,
    });
  }

  return (
    <Wrapper>
      <StatusGroup>
        {["all", "planned", "in progress", "completed"].map((status) => (
          <StatusButton
            key={status}
            $active={filters.status === status}
            onClick={() => handleStatusChange(status)}
          >
            {status}
          </StatusButton>
        ))}
      </StatusGroup>

      <RightSide>
        <FavButton $active={filters.favorites} onClick={toggleFavorites}>
          Favorites
        </FavButton>

        <ResetButton onClick={resetFilters}>Reset</ResetButton>
      </RightSide>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  @media (min-width: 768px) {
    justify-content: space-between;
  }
`;

const StatusGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const RightSide = styled.div`
  display: flex;
  gap: 8px;
`;

const StatusButton = styled.button`
  background: ${({ $active }) =>
    $active ? "#e50914" : "rgba(255,255,255,0.08)"};
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 600;
  &:hover {
    background: ${({ $active }) =>
      $active ? "#ff1f2d" : "rgba(255,255,255,0.14)"};
  }
`;

const FavButton = styled(StatusButton)``;

const ResetButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.14);
  }
`;
