import styled from "styled-components";

export default function BookmarkButton({ isFavorite, onToggle }) {
  function handleClick(event) {
    event.stopPropagation();
    event.preventDefault();
    onToggle();
  }
  return (
    <Button onClick={handleClick} $active={isFavorite}>
      {isFavorite ? "❤️" : "🤍"}
    </Button>
  );
}

const Button = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  backdrop-filter: blur(6px);
  background: ${({ $active }) => "rgba(0, 0, 0, 0.4)"};
  color: white;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.15);
    background: ${({ $active }) => "rgba(0, 0, 0, 0.7)"};
  }
`;
