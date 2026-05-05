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
  margin-bottom: 25px;
`;

const StatusGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatusButton = styled.button`
  background: ${({ $active }) => ($active ? "#e50914" : "#222")};
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
`;

const RightSide = styled.div`
  display: flex;
  gap: 8px;
`;

const FavButton = styled.button`
  background: ${({ $active }) => ($active ? "#e50914" : "#222")};
  color: white;
  border: none;
  padding: 6px 12px;
`;

const ResetButton = styled.button`
  background: #333;
  color: white;
  border: none;
  padding: 6px 12px;
`;
