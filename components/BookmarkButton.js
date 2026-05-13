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
  top: 14px;
  right: 14px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  cursor: pointer;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.45);
  color: white;
  opacity: 0;
  transform: scale(0.92);
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.08);
    background: rgba(0, 0, 0, 0.7);
  }
`;
