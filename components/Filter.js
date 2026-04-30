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
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const StatusGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatusButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#111" : "rgba(0,0,0,0.05)")};
  color: ${({ $active }) => ($active ? "white" : "#333")};
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    background: ${({ $active }) => ($active ? "#111" : "rgba(0,0,0,0.1)")};
  }
`;

const RightSide = styled.div`
  display: flex;
  gap: 8px;
`;

const FavButton = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  background: ${({ $active }) => ($active ? "#ff4d4f" : "rgba(255,77,79,0.1)")};
  color: ${({ $active }) => ($active ? "white" : "#ff4d4f")};
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-1px);
    background: ${({ $active }) =>
      $active ? "#e03131" : "rgba(255,77,79,0.2)"};
  }
`;

const ResetButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.06);
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.12);
  }
`;
