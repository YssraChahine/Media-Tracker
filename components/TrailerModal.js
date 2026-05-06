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
  background: rgba(0, 0, 0, 0.85);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16/9;
  border-radius: 12px;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 5;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
`;
