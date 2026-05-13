import styled from "styled-components";

export default function TrailerModal({ trailerKey, onClose }) {
  if (!trailerKey) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <CloseButton onClick={onClose}>X</CloseButton>

        <iframe
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
          title="Trailer"
          allowFullScreen
        />
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.82);
  backdrop-filter: blur(12px);
  animation: fadeIn 0.25s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 32px;
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 35px 100px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.03);
  transform: scale(0.96);
  animation: modalIn 0.25s ease forwards;
  @keyframes modalIn {
    to {
      transform: scale(1);
    }
  }
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  @media (max-width: 768px) {
    border-radius: 22px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 5;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.72),
    rgba(0, 0, 0, 0.5)
  );
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
  &:hover {
    transform: scale(1.08);
    background: linear-gradient(
      to bottom,
      rgba(229, 9, 20, 0.95),
      rgba(255, 48, 64, 0.85)
    );
    border-color: rgba(229, 9, 20, 0.4);
  }
`;
