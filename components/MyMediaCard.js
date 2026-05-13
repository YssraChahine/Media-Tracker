import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import BookmarkButton from "./BookmarkButton";

export default function MyMediaCard({
  item,
  onDelete,
  onToggleFavorite,
  mutate,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleStatusChange(newStatus) {
    try {
      const response = await fetch(`/api/media/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error("Update failed.");
      mutate?.();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Card>
        <Link
          href={`/media/${item.type === "series" ? "tv" : "movie"}/${item.apiId}?from=my-list`}
        >
          {" "}
          <PosterWrapper>
            <Poster
              src={item.imageUrl || "/placeholder.jpg"}
              alt={item.title}
            />
            <Overlay />
            <BookmarkButton
              isFavorite={item.isFavorite}
              onToggle={() => onToggleFavorite(item._id, item.isFavorite)}
            />
          </PosterWrapper>
        </Link>

        <Content>
          <TopRow>
            <Title>{item.title}</Title>
            <DeleteButton
              type="button"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              X
            </DeleteButton>
          </TopRow>

          <Modal>
            <Type>{item.type}</Type>
            <StatusSelect
              value={item.status}
              onChange={(event) => {
                handleStatusChange(event.target.value);
              }}
            >
              <option value="planned">Planned</option>
              <option value="in progress">In progress</option>
              <option value="completed">Completed</option>
            </StatusSelect>
          </Modal>
        </Content>
      </Card>

      {showConfirm && (
        <ModeOverlay>
          <Mode>
            <Text>Are you sure you want to delete this Media?</Text>

            <ButtonRow>
              <CancelButton onClick={() => setShowConfirm(false)}>
                {" "}
                Cancel
              </CancelButton>

              <ConfirmButton
                onClick={() => {
                  onDelete(item._id);
                  setShowConfirm(false);
                }}
              >
                Delete
              </ConfirmButton>
            </ButtonRow>
          </Mode>
        </ModeOverlay>
      )}
    </>
  );
}

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  backdrop-filter: blur(10px);
  &:hover {
    transform: translateY(-10px) scale(1.01);
    border-color: rgba(229, 9, 20, 0.22);
    box-shadow:
      0 35px 80px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(229, 9, 20, 0.08);
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  &:hover button {
    opacity: 1;
    transform: scale(1);
  }
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  transition: transform 0.45s ease;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.72) 35%,
    rgba(0, 0, 0, 0.18) 65%,
    transparent 100%
  );
`;

const Content = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  color: white;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Modal = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const Type = styled.span`
  font-size: 0.72rem;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
`;

const StatusSelect = styled.select`
  padding: 9px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.04)
  );
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.82rem;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
  &:focus {
    outline: none;
    border-color: rgba(229, 9, 20, 0.45);
  }
  &:hover {
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.06)
    );
  }
`;

const DeleteButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
  &:hover {
    background: rgba(229, 9, 20, 0.9);
    transform: scale(1.08);
  }
`;

const ModeOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
`;

const Mode = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 34px;
  border-radius: 32px;
  background: #171717;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  text-align: center;
  animation: fadeIn 0.2s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const Text = styled.p`
  color: #d4d4d4;
  line-height: 1.7;
  margin-bottom: 28px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const CancelButton = styled.button`
  padding: 12px 18px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ConfirmButton = styled.button`
  padding: 12px 18px;
  border-radius: 16px;
  border: none;
  background: #e50914;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
  &:hover {
    background: #ff1f2d;
    transform: translateY(-1px);
  }
`;
